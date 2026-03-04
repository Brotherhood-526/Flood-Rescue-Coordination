package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Account;
import com.rescue.backend.model.dao.AccountDAO;
import com.rescue.backend.view.dto.auth.request.LoginRequest;
import com.rescue.backend.view.dto.auth.response.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    @Autowired
    private AccountDAO accountDAO;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        String loginErrorMessage = "Số điện thoại hoặc mật khẩu không chính xác";

        Account account = accountDAO.findByPhone(loginRequest.phone())
                .orElseThrow(() -> new BadCredentialsException(loginErrorMessage));

        if (!bCryptPasswordEncoder.matches(loginRequest.password(), account.getPassword())) {
            throw new BadCredentialsException(loginErrorMessage);
        }

        boolean isRescueTeam =  "rescue team".equals(account.getRole());

        return new LoginResponse(
                account.getId(),
                account.getPhone(),
                account.getRole(),
                account.getName(),
                isRescueTeam ? account.getTeamName() : null,
                isRescueTeam ? account.getTeamSize() : null,
                isRescueTeam ? account.getLatitude() : null,
                isRescueTeam ? account.getLongitude() : null
        );

    }
}
