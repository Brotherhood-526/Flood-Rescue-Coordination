package com.rescue.backend.controller.rescueTeam;

import com.rescue.backend.DTOS.common.ResponseObject;
import com.rescue.backend.DTOS.rescueTeam.request.UpdateTaskRequest;
import com.rescue.backend.DTOS.rescueTeam.response.TaskDetailResponse;
import com.rescue.backend.DTOS.rescueTeam.response.TeamAssignmentResponse;
import com.rescue.backend.service.RescueTeamService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/rescue-team")
public class MissionController {

    @Autowired
    private RescueTeamService rescueTeamService;

    @GetMapping("/tasks")
    public ResponseEntity<ResponseObject> getMyTasks(
        @RequestParam(required = false) String filter,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(required = false) UUID testTeamId, // Dùng để test khi không có session
        HttpSession session
    ){
        UUID teamId = (UUID)session.getAttribute("TEAM_ID");

        if (teamId == null) {
            if (testTeamId != null) {
                teamId = testTeamId;
            } else {
                return ResponseEntity.status(401).body(
                        new ResponseObject(
                            "Login Failed",
                            "Lỗi: Bạn chưa đăng nhập hoặc chưa truyền ID để test",
                                null
                        )
                );
            }
        }

        Page<TeamAssignmentResponse> tasks = rescueTeamService.getTaskByFilter(teamId, filter, page);

        return ResponseEntity.status(HttpStatus.OK).body(
            new ResponseObject(
                "Created",
                "Trả về tasks cho đội cứu hộ",
                    tasks
            )
        );
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<ResponseObject> getTaskById(@PathVariable UUID id){
        TaskDetailResponse detailResponse = rescueTeamService.getAssignmentDetail(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject(
                        "Created",
                        "Danh sách yêu cầu tải thành công",
                        detailResponse
                )
        );
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<ResponseObject> updateTaskStatus(
            @PathVariable UUID id,
            @RequestBody UpdateTaskRequest updateRequest
    ){
        String result = rescueTeamService.updateAssignment(id, updateRequest);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject(
                        "Updated",
                        "Tự động chuyển về trang task",
                        result
                )
        );
    }
}
