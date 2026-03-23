package com.rescue.backend.controller.controller.coordinator;

import com.rescue.backend.model.service.DispatchService;
import com.rescue.backend.view.dto.chat.request.SendMessageRequest;
import com.rescue.backend.view.dto.common.ResponseObject;
import com.rescue.backend.view.dto.coordinator.request.RejectMissionRequest;
import com.rescue.backend.view.dto.coordinator.request.SpecificRequest;
import com.rescue.backend.view.dto.coordinator.request.TakeListRequest;
import com.rescue.backend.view.dto.coordinator.request.UpdateMissionRequest;
import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakePageResponse;
import com.rescue.backend.view.dto.message.request.SpecificMessagesRequest;
import com.rescue.backend.view.dto.message.response.SpecificMessagesResponse;
import com.rescue.backend.view.dto.vehicle.request.FilterVehicleRequest;
import com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/coordinator")
public class DispatchController {

    @Autowired
    private DispatchService dispatchService;

    @PostMapping("/takeListRequest")
    public ResponseEntity<ResponseObject> takeListRequest(@RequestBody TakeListRequest takeListRequest, HttpServletRequest session){
        try{
            TakePageResponse data =
                    dispatchService.getRequestCitizen(takeListRequest);

            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200, "Lấy danh sách thành công", data)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }

    @PostMapping("/takeSpecificRequest")
    public ResponseEntity<ResponseObject> takeSpecificRequest(@RequestBody SpecificRequest specificRequest, HttpServletRequest session){
        try{
            SpecificResponse data =
                    dispatchService.getSpecificRequest(specificRequest.id());
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200, "Lấy yêu cầu thành công", data)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ResponseObject> updateRequest(@RequestBody UpdateMissionRequest updateMissionRequest, HttpServletRequest session){

        try{

            boolean success = dispatchService.updateRequest(updateMissionRequest);

            if(success){
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ResponseObject(200, "Cập nhật yêu cầu thành công", null)
                );
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ResponseObject(400, "Không thể cập nhật yêu cầu", null)
            );

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<ResponseObject> rejectRequest(@RequestBody RejectMissionRequest rejectMissionRequest, HttpServletRequest session){
        try{
            boolean success = dispatchService.rejectRequest(rejectMissionRequest.id());

            if(success){
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ResponseObject(200, "Từ chối yêu cầu thành công", null)
                );
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ResponseObject(400, "Không thể từ chối yêu cầu", null)
            );

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }

    @PostMapping("/filterVehicle")
    public ResponseEntity<ResponseObject> filterVehicleByType(@RequestBody FilterVehicleRequest filterVehicleRequest, HttpServletRequest session){
        try{
            List<FilterVehicleResponse> data =
                    dispatchService.filterVehicleByType(filterVehicleRequest);

            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200, "Lấy danh sách thành công", data)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }

    @PostMapping("/chatBox")
    public ResponseEntity<ResponseObject> openChatBox(@RequestBody SpecificMessagesRequest specificMessagesRequest, HttpServletRequest session){
        try{
            List<SpecificMessagesResponse> data =
                    dispatchService.takeAllMessageOfRequest(specificMessagesRequest);

            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200, "Lấy tin nhắn thành công", data)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<ResponseObject> sendMessage(@RequestBody SendMessageRequest request, HttpServletRequest session){
        try{
            dispatchService.sendMessage(request);

            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject(200, "Gửi tin nhắn thành công","")
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject(401, "Không thể lấy dữ liệu", null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseObject(500, "Lỗi hệ thống", e.getMessage())
            );
        }
    }
//
//    @PostMapping("/filterRequest")
//    public  ResponseEntity<ResponseObject> takeListRequest(@RequestBody FilterRequest filterRequest, HttpServletRequest session){
//        try{
//            TakePageResponse data =
//                    dispatchService.filterRequestCitizen(filterRequest);
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
}
