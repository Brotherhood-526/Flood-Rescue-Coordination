package com.rescue.backend.controller.controller.coordinator;

import com.rescue.backend.model.service.DispatchService;
import com.rescue.backend.view.dto.chat.response.MessageResponse;
import com.rescue.backend.view.dto.common.ResponseObject;

import com.rescue.backend.view.dto.coordinator.request.UpdateRequest;
import com.rescue.backend.view.dto.coordinator.response.NearbyTeamResponse;
import com.rescue.backend.view.dto.coordinator.response.RequestDetailResponse;
import com.rescue.backend.view.dto.coordinator.response.RequestListResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/coordinator")
public class DispatchController {

    @Autowired
    private DispatchService dispatchService;

//    @PostMapping("/takeListRequest")
//    public ResponseEntity<ResponseObject> takeListRequest(@RequestBody TakeListRequest takeListRequest, HttpServletRequest session){
//        try{
//            TakePageResponse data =
//                    dispatchService.getRequestCitizen(takeListRequest);
//
//            return ResponseEntity.status(HttpStatus.OK).body(
//                    new ResponseObject(200, "Lấy danh sách thành công", data)
//            );
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
//            );
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
//            );
//        }
//    }
//
//    @PostMapping("/takeSpecificRequest")
//    public ResponseEntity<ResponseObject> takeSpecificRequest(@RequestBody SpecificRequest specificRequest, HttpServletRequest session){
//        try{
//            SpecificResponse data =
//                    dispatchService.getSpecificRequest(specificRequest.id());
//            return ResponseEntity.status(HttpStatus.OK).body(
//                    new ResponseObject(200, "Lấy yêu cầu thành công", data)
//            );
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
//            );
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
//            );
//        }
//    }
//
//    @PostMapping("/update")
//    public ResponseEntity<ResponseObject> updateRequest(
//            @RequestBody UpdateMissionReqeuest updateMissionReqeuest,
//            HttpServletRequest session
//    ){
//        try{
//
//            boolean success = dispatchService.updateRequest(updateMissionReqeuest);
//
//            if(success){
//                return ResponseEntity.status(HttpStatus.OK).body(
//                        new ResponseObject(200, "Cập nhật yêu cầu thành công", null)
//                );
//            }
//
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    new ResponseObject(400, "Không thể cập nhật yêu cầu", null)
//            );
//
//        } catch (Exception e) {
//
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
//            );
//        }
//    }
//
//    @PostMapping("/filterVehicle")
//    public ResponseEntity<ResponseObject> filterVehicleByType(@RequestBody FilterVehicleRequest filterVehicleRequest, HttpServletRequest session){
//        try{
//            List<FilterVehicleResponse> data =
//                    dispatchService.filterVehicleByType(filterVehicleRequest);
//
//            return ResponseEntity.status(HttpStatus.OK).body(
//                    new ResponseObject(200, "Lấy danh sách thành công", data)
//            );
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
//            );
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
//            );
//        }
//    }

    @GetMapping("/requests")
    public ResponseEntity<ResponseObject> getRequests(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page
    ) {
        try {
            Page<RequestListResponse> result = dispatchService.getRequests(status, page);
            return ResponseEntity.ok(new ResponseObject(200, "Success", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ResponseObject(400, e.getMessage(), null));
        }
    }


    @GetMapping("/requests/{requestId}")
    public ResponseEntity<ResponseObject> getRequestDetail(@PathVariable UUID requestId) {
        try {
            RequestDetailResponse result = dispatchService.getRequestDetail(requestId);
            return ResponseEntity.ok(new ResponseObject(200, "Success", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject(404, e.getMessage(), null));
        }
    }

    @GetMapping("/requests/{requestId}/nearby-teams")
    public ResponseEntity<ResponseObject> getNearbyTeams(
            @PathVariable UUID requestId,
            @RequestParam String vehicleType
    ) {
        try {
            List<NearbyTeamResponse> result = dispatchService.getNearbyTeams(requestId, vehicleType);
            return ResponseEntity.ok(new ResponseObject(200, "Success", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ResponseObject(400, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject(404, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Không thể lấy đội cứu hộ gần nhất", e.getMessage()));
        }
    }

    @PutMapping("/requests/{requestId}/accept")
    public ResponseEntity<ResponseObject> acceptRequest(
            @PathVariable UUID requestId,
            @RequestParam(required = false) UUID testAccountId,
            @RequestBody UpdateRequest dto,
            HttpSession session
    ) {
        UUID coordinatorId = testAccountId != null
                ? testAccountId
                : (UUID) session.getAttribute("STAFF_ID");

        if (coordinatorId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject(401, "Vui lòng đăng nhập hoặc truyền testAccountId", null));
        }

        try {
            RequestDetailResponse detail = dispatchService.updateRequest(requestId, coordinatorId, dto);
            return ResponseEntity.ok(new ResponseObject(200, "Chấp nhận yêu cầu thành công", detail));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject(404, e.getMessage(), null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ResponseObject(400, e.getMessage(), null));
        }
    }

    @GetMapping("/chat/{requestId}")
    public ResponseEntity<ResponseObject> getAllMessages(@PathVariable UUID requestId) {
        try {
            List<MessageResponse> result = dispatchService.takeAllMessageOfRequest(requestId);
            return ResponseEntity.ok(new ResponseObject(200, "Success", result));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject(404, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Không thể tải lịch sử chat", e.getMessage()));
        }
    }
}
