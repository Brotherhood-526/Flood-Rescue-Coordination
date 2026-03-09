package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Staff;
import com.rescue.backend.model.dao.AccountDAO;
import com.rescue.backend.view.dto.auth.request.LoginRequest;
import com.rescue.backend.view.dto.auth.response.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AccountDAO accountDAO;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        String loginErrorMessage = "Số điện thoại hoặc mật khẩu không chính xác";

        Staff staff = accountDAO.findByPhone(loginRequest.phone())
                .orElseThrow(() -> new BadCredentialsException(loginErrorMessage));

        if (!bCryptPasswordEncoder.matches(loginRequest.password(), staff.getPassword())) {
            throw new BadCredentialsException(loginErrorMessage);
        }

        boolean isRescueTeam =  "rescue team".equals(staff.getRole());

        return new LoginResponse(
                staff.getId(),
                staff.getPhone(),
                staff.getRole(),
                staff.getName(),
                isRescueTeam ? staff.getTeamName() : null,
                isRescueTeam ? staff.getTeamSize() : null,
                isRescueTeam ? staff.getLatitude() : null,
                isRescueTeam ? staff.getLongitude() : null
        );

    }
}
