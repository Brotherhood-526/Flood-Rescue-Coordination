package com.rescue.backend.controller.controller.rescueTeam;

import com.rescue.backend.controller.annotation.RequiresRole;
import com.rescue.backend.model.service.RescueTeamService;
import com.rescue.backend.view.dto.common.ResponseObject;
import com.rescue.backend.view.dto.rescueTeam.request.UpdateTaskRequest;
import com.rescue.backend.view.dto.rescueTeam.response.TaskDetailResponse;
import com.rescue.backend.view.dto.rescueTeam.response.TeamAssignmentResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/rescueteam")
@RequiresRole("rescue team")
public class MissionController {

    @Autowired
    private RescueTeamService rescueTeamService;

//    @GetMapping("/tasks")
//    public ResponseEntity<ResponseObject> getMyTasks(
//            @RequestParam(required = false) String filter,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(required = false) UUID testAccountId,
//            HttpSession session
//    ){
//        UUID teamId = (testAccountId != null) ? testAccountId : (UUID) session.getAttribute("TEAM_ID");
//
//        // Kiểm tra cuối cùng nếu cả 2 đều null
//        if (teamId == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//                    new ResponseObject(401, "Lỗi: Vui lòng truyền testAccountId trên Swagger hoặc đăng nhập", null)
//            );
//        }
//
//        Page<TeamAssignmentResponse> tasks = rescueTeamService.getTaskByFilter(teamId, filter, page);
//
//        return ResponseEntity.status(HttpStatus.OK).body(
//                new ResponseObject(200,"Trả về tasks cho đội cứu hộ",tasks)
//        );
//    }
//
//    @GetMapping("/tasks/{id}")
//    public ResponseEntity<ResponseObject> getTaskById(@PathVariable UUID id){
//        TaskDetailResponse detailResponse = rescueTeamService.getAssignmentDetail(id);
//        return ResponseEntity.status(HttpStatus.OK).body(
//                new ResponseObject(200,"Danh sách yêu cầu tải thành công",detailResponse)
//        );
//    }
//
//    @PatchMapping("/tasks/{id}/status")
//    public ResponseEntity<ResponseObject> updateTaskStatus(
//            @PathVariable UUID id,
//            @RequestBody UpdateTaskRequest updateRequest
//    ){
//        String result = rescueTeamService.updateAssignment(id, updateRequest);
//        return ResponseEntity.status(HttpStatus.OK).body(
//                new ResponseObject(201,"Tự động chuyển về trang task",result)
//        );
//    }
}
