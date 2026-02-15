package com.rescue.backend.service;

import com.rescue.backend.DTOS.auth.request.LoginRequest;
import com.rescue.backend.DTOS.auth.respone.LoginResponse;
import com.rescue.backend.model.Account;
import com.rescue.backend.repository.AccountRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public LoginResponse authenticateUser(LoginRequest loginRequest, HttpServletRequest request) {
        Account account = accountRepository.findByPhone(loginRequest.phone())
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Tài khoản không tồn tại"));

        boolean isPasswordMatch = bCryptPasswordEncoder.matches(loginRequest.password(), account.getPassword());
        if (!isPasswordMatch) {
            throw new RuntimeException("Sai mật khẩu hoặc só điện thoại");
        }

        HttpSession session = request.getSession();
        session.setAttribute("TEAM_ID", account.getId());
        session.setAttribute("ACCOUNT_ROLE", account.getRole());

        String teamName = null;
        Integer teamSize = null;
        BigDecimal latitude = null;
        BigDecimal longitude = null;

        if ("rescue team".equalsIgnoreCase(account.getRole())) {
            teamName = account.getTeamName();
            teamSize = account.getTeamSize();
            latitude = account.getLatitude();
            longitude = account.getLongitude();
        }

        return new LoginResponse(
                account.getId(),
                account.getPhone(),
                account.getRole(),
                account.getName(),
                teamName,
                teamSize,
                latitude,
                longitude
        );

    }
}
