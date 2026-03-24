package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Message;
import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.bean.Staff;
import com.rescue.backend.model.dao.MessageDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.StaffDAO;
import com.rescue.backend.view.dto.chat.response.MessageResponse;
import com.rescue.backend.view.dto.image.response.LookupImageResponse;
import com.rescue.backend.view.dto.rescueTeam.request.UpdateTaskRequest;
import com.rescue.backend.view.dto.rescueTeam.response.TaskDetailResponse;
import com.rescue.backend.view.dto.rescueTeam.response.TeamAssignmentResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RescueTeamService {

    @Autowired
    private  final RequestDAO requestDAO;
    private final StaffDAO staffDAO;
    private final MessageDAO messageDAO;
    private final ChatService chatService;

    public Page<TeamAssignmentResponse> getTaskByFilter(UUID teamId, String filter, int page) {
        // 1. Kiểm tra null/ empty
        if (filter == null || filter.isBlank()) {
            return fetchTaskByFilter(teamId, null, page);
        }

        String cleanFilter = filter.trim().toLowerCase();

        String dbStatus = switch (cleanFilter) {
            case "đang xử lý", "on the way" -> "đang xử lý";
            case "tạm hoãn", "delayed" -> "tạm hoãn";
            case "hoàn thành", "completed" -> "hoàn thành";
            default -> throw new IllegalArgumentException("Trạng thái lọc không hợp lệ: " + filter);
        };

        return fetchTaskByFilter(teamId, dbStatus, page);
    }

    private Page<TeamAssignmentResponse> fetchTaskByFilter(UUID teamId, String dbStatus, int page) {
        Pageable pageable = PageRequest.of(page, 1000, Sort.by("createdAt").descending());

        Page<Request> assignments = (dbStatus == null)
                ? requestDAO.findByRescueTeamId(teamId, pageable)
                : requestDAO.findByRescueTeamIdAndStatus(teamId, dbStatus, pageable);

        return assignments.map(assignment -> new TeamAssignmentResponse(
                assignment.getId(),
                assignment.getCitizen().getPhone(),
                assignment.getStatus(),
                assignment.getCreatedAt()
        ));
    }

    public TaskDetailResponse getAssignmentDetail(UUID assignmentId, UUID teamId) {
        Request assignment = requestDAO.findByRescueTeamIdAndId(teamId, assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhiệm vụ"));


        List<LookupImageResponse> imageResponses = assignment.getImages().stream()
                .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                .toList();

        return new TaskDetailResponse(
                assignment.getId(),
                assignment.getCitizen().getId(),
                assignment.getCitizen().getName(),
                assignment.getCitizen().getPhone(),
                assignment.getUrgency(),
                assignment.getAddress(),
                assignment.getLatitude().doubleValue(),
                assignment.getLongitude().doubleValue(),
                assignment.getVehicle().getType(), // vehicleType
                assignment.getDescription(),
                assignment.getCoordinator().getName(),
                assignment.getCreatedAt().toString(),
                assignment.getStatus(),
                imageResponses
        );
    }

    @Transactional
    public String updateAssignment(UUID assignmentId, UpdateTaskRequest updateTaskRequest) {
        Request assignment = requestDAO.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi phân công"));

        assignment.setReport(updateTaskRequest.report());

        String status = updateTaskRequest.status().toLowerCase();
        switch (status) {
            case "hoàn thành", "completed":
                assignment.setStatus("hoàn thành");
                break;
            case "tạm hoãn", "delayed":
                assignment.setStatus("tạm hoãn");
                break;
            default:
                throw new IllegalArgumentException("Trạng thái không hợp lệ");
        }

        requestDAO.save(assignment);

        return (assignment.getStatus().equalsIgnoreCase("hoàn thành")) ? "Nhiệm vụ hoàn thành" : "Nhiệm vụ đã được tạm hoãn";
    }

    public List<MessageResponse> getAllMessagesByRequest(UUID requestId) {
        return chatService.takeAllMessageOfRequest(requestId);
    }

    @Transactional
    public MessageResponse sendMessage(
            UUID requestId,
            UUID senderId,
            String content,
            LocalDateTime sendAt
    ) {
        if (requestId == null) {
            throw new IllegalArgumentException("Thiếu requestId");
        }
        if (senderId == null) {
            throw new IllegalArgumentException("Thiếu senderId");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung tin nhắn không được để trống");
        }

        Request request = requestDAO.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy yêu cầu với id: " + requestId));

        Staff sender = staffDAO.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đội cứu hộ với id: " + senderId));
        if (sender.getRole() == null || !sender.getRole().trim().equalsIgnoreCase("cứu hộ")) {
            throw new IllegalArgumentException("Tài khoản gửi tin nhắn không phải đội cứu hộ");
        }

        Message message = new Message();
        message.setRequest(request);
        message.setSenderId(senderId);
        message.setSenderRole("cứu hộ");
        message.setContent(content.trim());
        message.setSendAt(sendAt != null ? sendAt : LocalDateTime.now());

        Message saved = messageDAO.save(message);

        return new MessageResponse(
                saved.getId(),
                senderId,
                sender.getName(),
                saved.getSenderRole(),
                saved.getContent(),
                saved.getSendAt()
        );
    }
}
