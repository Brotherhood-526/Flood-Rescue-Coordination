package com.rescue.backend.controller.auth;

import com.rescue.backend.DTOS.auth.request.LoginRequest;
import com.rescue.backend.DTOS.auth.respone.LoginResponse;
import com.rescue.backend.DTOS.common.ResponseObject;
import com.rescue.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseObject> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            LoginResponse account = authService.authenticateUser(loginRequest, request);

            return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Đăng nhập thành công", account)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ResponseObject("Failure", "Số điện thoại hoặc mật khẩu không đúng", null)
            );
        }
    }
}
