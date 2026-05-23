package com.rescue.backend.model.service;

import com.rescue.backend.controller.exception.BusinessException;
import com.rescue.backend.controller.exception.ErrorCode;
import com.rescue.backend.model.bean.Staff;
import com.rescue.backend.model.dao.StaffDAO;
import com.rescue.backend.view.dto.auth.request.LoginRequest;
import com.rescue.backend.view.dto.auth.response.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final String RESCUE_TEAM = "cứu hộ";

    @Autowired
    private StaffDAO staffDAO;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {

        Staff staff = staffDAO.findByPhone(loginRequest.phone())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!bCryptPasswordEncoder.matches(loginRequest.password(), staff.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        boolean isRescueTeam = RESCUE_TEAM.equalsIgnoreCase(staff.getRole());

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