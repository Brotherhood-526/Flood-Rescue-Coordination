package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.dao.RequestDAO;
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

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RescueTeamService {

    @Autowired
    private  final RequestDAO requestDAO;

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

        List<LookupImageResponse> imageResponses = (assignment.getImages() != null)
                ? assignment.getImages().stream()
                .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                .toList()
                : Collections.emptyList();

        return new TaskDetailResponse(
                assignment.getId(),
                assignment.getCitizen().getId(),
                assignment.getCitizen().getName(),
                assignment.getCitizen().getPhone(),
                assignment.getUrgency(),
                assignment.getAddress(),
                assignment.getLatitude() != null ? assignment.getLatitude().doubleValue() : 0.0,
                assignment.getLongitude() != null ? assignment.getLongitude().doubleValue() : 0.0,
                assignment.getVehicle() != null ? assignment.getVehicle().getType() : "Chưa điều xe",
                assignment.getDescription(),
                assignment.getCoordinator() != null ? assignment.getCoordinator().getName() : "Hệ thống tự động",
                assignment.getCreatedAt() != null ? assignment.getCreatedAt().toString() : "",
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
            case "đã hoàn thành", "completed":
                assignment.setStatus("đã hoàn thành");
                break;
            case "tạm hoãn", "delayed":
                assignment.setStatus("tạm hoãn");
                break;
            default:
        }

        requestDAO.save(assignment);

        return (status.equalsIgnoreCase("đã hoàn thành")) ? "Nhiệm vụ hoàn thành" : "Nhiệm vụ đã được tạm hoãn";
    }
}
