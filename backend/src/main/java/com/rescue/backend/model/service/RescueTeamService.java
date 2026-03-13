package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.VehicleDAO;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RescueTeamService {

    @Autowired
    private  final RequestDAO requestDAO;

    @Autowired
    private final VehicleDAO vehicleDAO;

    public Page<TeamAssignmentResponse> getTaskByFilter(UUID teamId, String filter, int page) {
        // 1. Kiểm tra null/ empty
        if (filter == null || filter.isBlank()) {
            return fetchTaskByFilter(teamId, null, page);
        }

        String cleanFilter = filter.trim().toLowerCase();

        String dbStatus = switch (cleanFilter) {
            case "đang xử lý", "on the way" -> "on the way";
            case "tạm hoãn", "delayed" -> "delayed";
            case "hoàn thành", "completed" -> "completed";
            default -> throw new IllegalArgumentException("Trạng thái lọc không hợp lệ: " + filter);
        };

        return fetchTaskByFilter(teamId, dbStatus, page);
    }

    private Page<TeamAssignmentResponse> fetchTaskByFilter(UUID teamId, String dbStatus, int page) {
        Pageable pageable = PageRequest.of(page, 20, Sort.by("request.createdAt").descending());

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

    public TaskDetailResponse getAssignmentDetail(UUID assignmentId) {
        Request assignment = requestDAO.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhiệm vụ"));


        List<LookupImageResponse> imageResponses = assignment.getImages().stream()
                .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                .toList();

        return new TaskDetailResponse(
                assignment.getId(),
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
                imageResponses
        );
    }

    @Transactional
    public String updateAssignment(UUID assignmentId, UpdateTaskRequest updateTaskRequest) {
        Request assignment = requestDAO.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi phân công"));

        assignment.setStatus(updateTaskRequest.status().toLowerCase());
        assignment.setReport(updateTaskRequest.report());

        String status = updateTaskRequest.status().toLowerCase();
        switch (status) {
            case "hoàn thành", "completed":
                assignment.setStatus("completed");
                break;
            case "tạm hoãn", "delayed":
                assignment.setStatus("delayed");
                break;
            default:
        }

        requestDAO.save(assignment);

        return (status.equalsIgnoreCase("hoàn thành")) ? "Nhiệm vụ hoàn thành" : "Nhiệm vụ đã được tạm hoãn";
    }
}
