package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.bean.RescueTeamAssignment;
import com.rescue.backend.model.bean.Vehicle;
import com.rescue.backend.model.dao.RescueTeamAssignmentDAO;
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
    private final RescueTeamAssignmentDAO rescueTeamAssignmentDAO;

    @Autowired
    private final VehicleDAO vehicleDAO;

    public Page<TeamAssignmentResponse> getTaskByFilter(UUID teamId, String filter, int page) {
        String dbStatus = (filter == null) ? null : switch (filter.toLowerCase()) {
            case "đang xử lý" -> "on the way";
            case "tạm hoãn" -> "delayed";
            case "hoàn thành" -> "completed";
            default -> null;
        };

        // Tạo pageable cho trang hiện tại, mỗi trang 20 bản ghi
        Pageable pageable = PageRequest.of(page, 20, Sort.by("request.createdAt").descending());

        Page<RescueTeamAssignment> assignments = rescueTeamAssignmentDAO.findByTeamAndStatus(teamId, dbStatus, pageable);

        return assignments.map(assignment -> new TeamAssignmentResponse(
                assignment.getId(),
                assignment.getRequest().getCitizen().getPhone(),
                assignment.getStatus(),
                assignment.getRequest().getCreatedAt()
        ));
    }

    public TaskDetailResponse getAssignmentDetail(UUID assignmentId) {
        RescueTeamAssignment assignment = rescueTeamAssignmentDAO.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhiệm vụ"));

        Request request = assignment.getRequest();

        List<LookupImageResponse> imageResponses = request.getImages().stream()
                .map(img -> new LookupImageResponse(img.getId(), img.getImageUrl()))
                .toList();

        String vType = "N/A";
        if (assignment.getVehicleId() != null) {
            vType = vehicleDAO.findById(assignment.getVehicleId())
                    .map(Vehicle::getType)
                    .orElse("Unknown");
        }

        return new TaskDetailResponse(
                assignment.getId(),                             // assignmentId
                request.getId(),                                // requestId
                request.getCitizen().getId(),
                request.getCitizen().getName(),                    // citizenName (Lưu ý: dùng .getUser() hoặc .getCitizen() tùy Entity)
                request.getCitizen().getPhone(),                   // citizenPhone
                request.getUrgency(),                           // urgency
                request.getAddress(),                           // address
                request.getLatitude().doubleValue(),            // latitude
                request.getLongitude().doubleValue(),           // longitude
                vType, // vehicleType
                request.getDescription(),                       // description
                assignment.getCoordinator().getName(),          // coordinatorName (ĐẢM BẢO DÒNG NÀY CÓ TRƯỚC IMAGES)
                request.getCreatedAt().toString(),              // createdAt
                imageResponses                                  // images (List phải nằm cuối cùng)
        );
    }

    @Transactional
    public String updateAssignment(UUID assignmentId, UpdateTaskRequest updateTaskRequest) {
        RescueTeamAssignment assignment = rescueTeamAssignmentDAO.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi phân công"));

        Request request = assignment.getRequest();

        assignment.setStatus(updateTaskRequest.status());
        assignment.setReport(updateTaskRequest.report());

        String status = updateTaskRequest.status().toLowerCase();
        switch (status) {
            case "hoàn thành":
                assignment.setStatus("completed");
                request.setStatus("completed");
                break;
            case "tạm hoãn":
                assignment.setStatus("delayed");
                request.setStatus("delayed");
                break;
            default:
        }

        rescueTeamAssignmentDAO.save(assignment);

        return (status.equalsIgnoreCase("hoàn thành")) ? "Nhiệm vụ hoàn thành" : "Nhiệm vụ đã được tạm hoãn";
    }
}
