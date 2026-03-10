package com.rescue.backend.controller.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rescue.backend.controller.annotation.RequiresRole;
import com.rescue.backend.view.dto.common.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.jspecify.annotations.NonNull;
import org.springframework.messaging.handler.HandlerMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class RoleInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        HttpSession session = request.getSession();
        String userRole = (String) session.getAttribute("ACCOUNT_ROLE");

        // Dùng getServletPath() để lấy đường dẫn sau context-path
        String path = request.getServletPath().toLowerCase();

        // --- CƠ CHẾ 1: KIỂM TRA THEO ANNOTATION (ƯU TIÊN) ---
        RequiresRole annotation = handlerMethod.getMethodAnnotation(RequiresRole.class);
        if (annotation == null) {
            annotation = handlerMethod.getBeanType().getAnnotation(RequiresRole.class);
        }


        if (annotation != null) {
            List<String> allowedRoles = Arrays.asList(annotation.value());
            if (userRole == null || !allowedRoles.contains(userRole)) {
                return handleRedirect(request, response, userRole);
            }
            return true;
        }

        // 1. CƠ CHẾ 2: KIỂM TRA THEO PREFIX
        boolean isForbidden = false;

        // Kiểm tra startsWith để tránh hacker lách luật bằng URL như /public/manager-info
        if (path.startsWith("/manager/") && !"manager".equals(userRole)) isForbidden = true;
        else if (path.startsWith("/coordinator/") && !"rescue coordinator".equals(userRole)) isForbidden = true;
        else if (path.startsWith("/rescueteam/") && !"rescue team".equals(userRole)) isForbidden = true;

        if  (isForbidden) {
            return handleRedirect(request, response, userRole);
        }

        return true;
    }

    private boolean handleRedirect(HttpServletRequest request, HttpServletResponse response, String role) throws IOException {
        String contextPath = request.getContextPath();
        String redirectUrl;

        // Xác định URL đích
        if (role == null) {
            redirectUrl = "/login";
        } else {
            redirectUrl = switch (role) {
                case "manager" -> "/manager/dashboard";
                case "rescue coordinator" -> "/coordinator/mission";
                case "rescue team" -> "/rescueteam/tasks";
                default -> "/login";
            };
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");

        ResponseObject responseObject = new ResponseObject(403, "Access Denied", redirectUrl);

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(responseObject));

        return false;
    }
}
