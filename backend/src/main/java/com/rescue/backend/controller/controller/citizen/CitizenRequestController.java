package com.rescue.backend.controller.controller.citizen;

import com.rescue.backend.model.service.CitizenService;
import com.rescue.backend.view.dto.citizen.request.LookupRequest;
import com.rescue.backend.view.dto.citizen.request.RescueRequest;
import com.rescue.backend.view.dto.citizen.request.UpdateRequest;
import com.rescue.backend.view.dto.citizen.response.CitizenRescueResponse;
import com.rescue.backend.view.dto.common.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/citizen")
public class CitizenRequestController {
    private final CitizenService citizenService;

    public CitizenRequestController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }


    @PostMapping(value = "/sendRequest", consumes = {"multipart/form-data"})
    public ResponseEntity<ResponseObject> sendRequest(@ModelAttribute RescueRequest rescueRequest) {
        // Sử dụng @ModelAttribute để nhận cả các field text và danh sách MultipartFile
        try {
            var savedRequest = citizenService.createRescueRequest(rescueRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new ResponseObject(201, "Yêu cầu đã được gửi", savedRequest)
            );
        } catch (RuntimeException e) {
            if ("EXISTING_ACTIVE_REQUEST".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        new ResponseObject(400, "Bạn đã có một yêu cầu đang được xử lý. Vui lòng vào trang tra cứu để theo dõi.", null)
                );
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống: " + e.getMessage(), null)
            );
        }
    }

    @PostMapping(value = "/lookup")
    public ResponseEntity<ResponseObject> lookup(@RequestBody LookupRequest lookupRequest) {
        CitizenRescueResponse response = citizenService.lookUpRequest(lookupRequest);

        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject(404,
                            "Không tìm thấy yêu cầu đang được xử lí hay tạm hoãn của số điện thoại này",
                            null));
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200, "Tìm thấy thông tin yêu cầu cứu hộ", response)
            );
        }

    }

    @PutMapping(value = "/edit", consumes = {"multipart/form-data"})
    public ResponseEntity<ResponseObject> edit(@ModelAttribute UpdateRequest updateRequest) {
        try {
            CitizenRescueResponse response = citizenService.updateRescueRequest(updateRequest);

            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200,
                            "Thông tin đã được chỉnh sửa thành công",
                            response
                    )
            );
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject( 500,
                            "Lỗi server",
                            e.getMessage()
                    )
            );
        }
    }
    @PutMapping("/cancel/{id}")
    public ResponseEntity<ResponseObject> cancelRequest(@PathVariable Long id) {
        try {
            citizenService.cancelRequest(id);
            return ResponseEntity.ok(new ResponseObject(200, "Đã hủy yêu cầu", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject(500, "Lỗi hệ thống", null));
        }
    }
}

//    @PostMapping("/sendRequest")
//    public ResponseEntity<ResponseObject> sendRequest(@RequestBody RescueRequest rescueRequest) {
//        var savedRequest = citizenService.createRescueRequest(rescueRequest);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(
//            new ResponseObject("success", "Yêu cầu cứu hộ đã được gửi thành công", savedRequest)
//        );
//    }
