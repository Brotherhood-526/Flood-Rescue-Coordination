package com.rescue.backend.model.service;


import com.rescue.backend.model.bean.Message;
import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.bean.Staff;
import com.rescue.backend.model.bean.Vehicle;
import com.rescue.backend.model.dao.MessageDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.StaffDAO;
import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.chat.request.SendMessageRequest;
import com.rescue.backend.view.dto.chat.response.MessageResponse;
import com.rescue.backend.view.dto.coordinator.request.TakeListRequest;
import com.rescue.backend.view.dto.coordinator.request.UpdateRequest;
import com.rescue.backend.view.dto.coordinator.response.*;
import com.rescue.backend.view.dto.image.response.CoordinatorImageResponse;
import com.rescue.backend.view.dto.vehicle.request.FilterVehicleRequest;
import com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DispatchService {

    @Autowired
    private RequestDAO requestDAO;


    @Autowired
    private VehicleDAO vehicleDAO;

    @Autowired
    private StaffDAO staffDAO;

    @Autowired
    private MessageDAO messageDAO;

    @Autowired
    private ChatService chatService;

    private static final int PAGE_SIZE = 1000;
    private static final List<String> VALID_VEHICLE_TYPES =
            List.of("xuồng", "xe cứu hộ", "trực thăng");
    private static final List<String> VALID_URGENCY_TYPES =
            List.of("cao", "trung bình", "thấp");

    public TakePageResponse getRequestCitizen(TakeListRequest takeListRequest) {
        Page<TakeListResponse> page =
                requestDAO.getRequestCitizen(takeListRequest.status(), PageRequest.of(takeListRequest.pageNumber(), takeListRequest.pageSize()));

        return new TakePageResponse(page.getTotalPages(), page.getContent());
    }

    public SpecificResponse getSpecificRequest(UUID id) {
        SpecificResponse response = requestDAO.findRequestDetail(id);

        if (response == null) {
            throw new RuntimeException("Request not found");
        }

        return response;
    }

//    @Transactional
//    public boolean updateRequest(UpdateMissionReqeuest req) {
//
//        int vehicleUpdated =
//                vehicleDAO.setVehicle(req.vehicleId(), req.vehicleState());
//
//        if (vehicleUpdated == 0) {
//            return false;
//        }
//
//        int requestUpdated = requestDAO.updateRequest(
//                req.id(),
//                req.status(),
//                req.urgency(),
//                req.rescueTeamId(),
//                req.vehicleId()
//        );
//
//        if (requestUpdated == 0) {
//            vehicleDAO.setVehicle(req.vehicleId(), "free");
//            throw new RuntimeException("Update request failed");
//        }
//
//        return true;
//    }

    public List<FilterVehicleResponse> filterVehicleByType(FilterVehicleRequest filterVehicleRequest) {
        return vehicleDAO.filterVehicleByType(filterVehicleRequest.vehicle_type());
    }

    public Page<RequestListResponse> getRequests(String status, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());

        Page<Request> requests;

        if (status == null || status.isBlank()) {
            requests = requestDAO.findAll(pageable);
        } else {
            String cleanStatus = switch (status.trim().toLowerCase()) {
                case "yêu cầu mới", "new" -> "yêu cầu mới";
                case "đang xử lý", "processing" -> "đang xử lý";
                case "tạm hoãn", "delayed" -> "tạm hoãn";
                case "hoàn thành", "completed" -> "hoàn thành";
                case "đã huỷ", "rejected" -> "đã huỷ";
                default -> throw new IllegalArgumentException(
                        "Status không hợp lệ: " + status);
            };
            requests = requestDAO.findAllByStatus(cleanStatus, pageable);
        }

        return requests.map(r -> new RequestListResponse(
                r.getId(),
                r.getCitizen().getName(),
                r.getCitizen().getPhone(),
                r.getStatus(),
                r.getCreatedAt()
        ));
    }

    public RequestDetailResponse getRequestDetail(UUID requestId) {
        Request r = requestDAO.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy yêu cầu với id: " + requestId));

        List<CoordinatorImageResponse> images =
                (r.getImages() != null)
                        ? r.getImages().stream()
                        .map(img -> new CoordinatorImageResponse(img.getId(), img.getImageUrl()))
                        .toList()
                        : List.of();

        String vehicleType = (r.getVehicle() != null) ? r.getVehicle().getType() : null;
        String rescueTeamName = null;
        BigDecimal rescueTeamLatitude = null;
        BigDecimal rescueTeamLongitude = null;

        if (r.getRescueTeam() != null) {
            rescueTeamName = r.getRescueTeam().getTeamName();
            rescueTeamLatitude = r.getRescueTeam().getLatitude();
            rescueTeamLongitude = r.getRescueTeam().getLongitude();
        }

        return new RequestDetailResponse(
                r.getId(),
                r.getStatus(),
                r.getUrgency(),
                r.getCitizen().getName(),
                r.getCitizen().getPhone(),
                r.getAddress(),
                r.getLatitude(),
                r.getLongitude(),
                r.getDescription(),
                r.getAdditionalLink(),
                images,
                vehicleType,
                rescueTeamName,
                rescueTeamLatitude,
                rescueTeamLongitude
        );
    }

    public List<NearbyTeamResponse> getNearbyTeams(UUID requestId, String vehicleType) {
        if (vehicleType == null
                || !VALID_VEHICLE_TYPES.contains(vehicleType.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Loại phương tiện không hợp lệ. Chỉ chấp nhận: 'xuồng', 'xe cứu hộ', 'trực thăng'");
        }

        Request request = requestDAO.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy yêu cầu với id: " + requestId));

        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalStateException(
                    "Yêu cầu chưa có thông tin vị trí của yêu cầu cứu hộ, không thể tìm đội gần nhất");
        }

        double lat = request.getLatitude().doubleValue();
        double lng = request.getLongitude().doubleValue();

        List<Object[]> rows = staffDAO.findTop4NearbyTeams(
                lng, lat, vehicleType.trim().toLowerCase());

        if (rows == null || rows.isEmpty()) {
            throw new IllegalStateException(
                    "Không tìm thấy đội cứu hộ nào phù hợp với phương tiện: " + vehicleType);
        }

        return rows.stream()
                .map(row -> new NearbyTeamResponse(
                        UUID.fromString((String) row[0]),
                        (String) row[1]
                ))
                .toList();
    }

    public RequestDetailResponse updateRequest(UUID requestID, UUID coordinatorID, UpdateRequest dto) {
        Request request = requestDAO.findById(requestID)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy yêu cầu với id: " + requestID));

        if (dto.status() != null) {
            String newStatus = switch (dto.status().trim().toLowerCase()) {
                case "đang xử lý", "processing" -> "đang xử lý";
                case "đã huỷ", "rejected" -> "đã huỷ";
                default -> throw new IllegalArgumentException(
                        "Coordinator chỉ được set status 'đang xử lý' hoặc 'đã huỷ'");
            };

            if (!"yêu cầu mới".equals(request.getStatus())) {
                throw new IllegalStateException(
                        "Yêu cầu đang ở trạng thái '" + request.getStatus()
                                + "', không thể cập nhật");
            }
            request.setStatus(newStatus);
        }

        String urgency = dto.urgency();

        if (urgency == null || !VALID_URGENCY_TYPES.contains(urgency.trim().toLowerCase())) {
            throw new IllegalArgumentException("Mức độ khẩn cấp không hợp lệ. Chỉ chấp nhận: 'cao', 'trung bình', 'thấp'");
        }
        request.setUrgency(dto.urgency());

        Staff rescueTeam = staffDAO.findById(dto.rescueTeamID())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đội cứu hộ với id: " + dto.rescueTeamID()));
        request.setRescueTeam(rescueTeam);

        Staff coordinator = staffDAO.findById(coordinatorID)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy điều phối viên với id: " + coordinatorID));
        request.setCoordinator(coordinator);

        String type = dto.vehicleType();
        if (type == null || !VALID_VEHICLE_TYPES.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ. Chỉ chấp nhận: 'đang sử dụng', 'không hoạt động' hoặc 'bảo trì'");
        }

        Vehicle vehicle = vehicleDAO
                .findAvailableVehicle(dto.rescueTeamID(), dto.vehicleType(), PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Không có phương tiện khả dụng"));
        vehicle.setState("đang sử dụng");

        request.setVehicle(vehicle);

        requestDAO.save(request);
        vehicleDAO.save(vehicle);
        return getRequestDetail(request.getId());
    }

    @Transactional
    public int sendMessage(SendMessageRequest request) {

        Message message = new Message();

        message.setSenderRole(request.senderRole());
        message.setContent(request.content());
        message.setSenderId(request.senderId());

        message.setSendAt(
                request.sendAt() != null ? request.sendAt() : LocalDateTime.now()
        );

        Request req = new Request();
        req.setId(request.requestId());
        message.setRequest(req);

        messageDAO.save(message);

        return 1;
    }

    public List<MessageResponse> takeAllMessageOfRequest(UUID requestId){
        return chatService.takeAllMessageOfRequest(requestId);
    }
}
