package com.rescue.backend.model.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.rescue.backend.model.bean.*;
import com.rescue.backend.model.dao.CitizenDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.RequestImageDAO;
import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.citizen.request.LookupRequest;
import com.rescue.backend.view.dto.citizen.request.RescueRequest;
import com.rescue.backend.view.dto.citizen.request.UpdateRequest;
import com.rescue.backend.view.dto.citizen.response.CitizenRescueResponse;
import com.rescue.backend.view.dto.image.response.LookupImageResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.rescue.backend.utils.CloudinaryUtils.extractPublicId;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenService {

    private final CitizenDAO citizenDAO;
    private final VehicleDAO vehicleDAO;
    private final RequestDAO requestDAO;
    private final RequestImageDAO requestImageDAO;
    private final Cloudinary cloudinary;

    @Transactional
    public CitizenRescueResponse createRescueRequest(RescueRequest rescueRequest) {
        // 1. Danh sách các trạng thái "chặn" không cho gửi thêm
        List<String> activeStatuses = List.of("processing", "accept", "delayed");
        Optional<Request> existingRequest = requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
                activeStatuses,
                rescueRequest.phone()
        );

        // 3. Nếu tìm thấy request đang hoạt động -> Thông báo lỗi
        if (existingRequest.isPresent()) {
            throw new RuntimeException("EXISTING_ACTIVE_REQUEST");
            // Bạn có thể tạo Custom Exception riêng để Controller bắt được dễ hơn
        }

        Citizen citizen = citizenDAO.findByPhone(rescueRequest.phone())
                .orElseGet(() -> {
                    log.info("Creating new citizen with phone: {}", rescueRequest.phone());
                    Citizen newCitizen = new Citizen();
                    newCitizen.setPhone(rescueRequest.phone());
                    newCitizen.setName(rescueRequest.name());
                    return citizenDAO.save(newCitizen);
                });

        Request request = new Request();
        request.setCitizen(citizen);
        request.setType(rescueRequest.type().toLowerCase());
        request.setDescription(rescueRequest.description());
        request.setAddress(rescueRequest.address());
        request.setLatitude(rescueRequest.latitude());
        request.setLongitude(rescueRequest.longitude());
        request.setAdditionalLink(rescueRequest.additionalLink());

        Request savedRequest = requestDAO.save(request);

        // 5. Xử lý Upload ảnh lên Cloudinary
        if (rescueRequest.images() != null && !rescueRequest.images().isEmpty()) {
            List<RequestImage> requestImageList = uploadNewImages(rescueRequest.images(), savedRequest);;

            if (!requestImageList.isEmpty()) {
                requestImageDAO.saveAll(requestImageList);
                savedRequest.setImages(requestImageList);
            }
        } else {
            savedRequest.setImages(new ArrayList<>());
        }

        return mapToRequestResponse(savedRequest);
    }

    public CitizenRescueResponse mapToRequestResponse(Request request) {
        List<LookupImageResponse> imageList = (request.getImages() != null)
                ? request.getImages().stream()
                        .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                                .toList()
                : List.of();

        String coordinator = null;
        String leader = null;
        String vehicle = null;

        if (request.getRescueTeamAssignment() != null && !request.getRescueTeamAssignment().isEmpty()) {
            var assignment = request.getRescueTeamAssignment().getFirst();
            coordinator = assignment.getCoordinator().getName();
            leader = assignment.getRescueTeam().getName();
            vehicle = vehicleDAO.findById(assignment.getVehicleId())
                                .map(Vehicle::getType)
                                .orElse(null);
        }
        return new CitizenRescueResponse(
            request.getId(),
            request.getAddress(),
            request.getDescription(),
            request.getAdditionalLink(),
            request.getCreatedAt(),
            request.getLatitude(),
            request.getLongitude(),
            request.getStatus(),
            request.getType(),
            request.getUrgency(),
            request.getCitizen().getId(),
            request.getCitizen().getName(),
            request.getCitizen().getPhone(),
            imageList,
            coordinator,
            leader,
            vehicle
        );
    }

    public CitizenRescueResponse lookUpRequest(LookupRequest lookupRequest) {
        List<String> targetStatues = List.of("processing", "delayed", "reject", "accept");

        return requestDAO.findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(targetStatues, lookupRequest.citizenPhone())
                .map(this::mapToRequestResponse)
                .orElse(null);
    }

    @Transactional
    public CitizenRescueResponse updateRescueRequest(UpdateRequest updateRequest) {
        Request request = requestDAO.findById(updateRequest.requestId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu này"));

        request.setType(updateRequest.Type());
        request.setDescription(updateRequest.description());
        request.setAddress(updateRequest.address());
        request.setAdditionalLink(updateRequest.additionLink());
        request.setLatitude(updateRequest.latitude());
        request.setLongitude(updateRequest.longitude());

        Citizen citizen = request.getCitizen();
        citizen.setName(updateRequest.citizenName());
        // Kiểm tra nếu số điện thoại thay đổi (tránh lỗi duplicate nếu không cần thiết)
        if (!citizen.getPhone().equals(updateRequest.citizenPhone())) {
            // Có thể thêm logic kiểm tra trùng số điện thoại ở đây nếu cần
            citizen.setPhone(updateRequest.citizenPhone());
        }

        if (updateRequest.deleteImageIds() != null && !updateRequest.deleteImageIds().isEmpty()) {
            List<RequestImage> imagesToDelete = requestImageDAO.findAllById(updateRequest.deleteImageIds());

            // Xóa trên Cloudinary
            imagesToDelete.forEach(this::deleteImageOnCloudinary);

            // Xóa trong DB
            requestImageDAO.deleteAll(imagesToDelete);

            // QUAN TRỌNG: Xóa khỏi danh sách trong bộ nhớ (để response trả về đúng ngay lập tức)
            request.getImages().removeAll(imagesToDelete);
        }

        Request savedRequest = requestDAO.save(request);

        if (updateRequest.images() != null && !updateRequest.images().isEmpty()) {
            List<RequestImage> newImages = uploadNewImages(updateRequest.images(), request);

            if (!newImages.isEmpty()) {
                requestImageDAO.saveAll(newImages);

                // QUAN TRỌNG: Thêm vào danh sách hiện tại thay vì ghi đè (setImages)
                if (request.getImages() == null) {
                    request.setImages(new ArrayList<>());
                }
                request.getImages().addAll(newImages);
            }
        } else {
            request.setImages(new ArrayList<>());
        }

        return mapToRequestResponse(savedRequest);
    }

    private void deleteImageOnCloudinary(RequestImage image) {
        try {
            String publicId = extractPublicId(image.getImageUrl());
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.warn("Không thể xóa ảnh trên Cloudinary: {}", image.getImageUrl());
        }
    }

    private List<RequestImage> uploadNewImages(List<MultipartFile> files, Request request) {
        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> {
                    try {
                        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                                ObjectUtils.asMap(
                                        "folder", "rescue_requests",
                                        "transformation", new Transformation<>()
                                                .width(1000).crop("limit")
                                                .quality("auto")
                                                .fetchFormat("auto")
                                ));

                        RequestImage image = new RequestImage();
                        image.setImageUrl(uploadResult.get("secure_url").toString());
                        image.setRequest(request);
                        return image;
                    } catch (IOException e) {
                        log.error("Lỗi upload ảnh: {}", file.getOriginalFilename());
                        throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);
                    }
                }).toList();
    }
}