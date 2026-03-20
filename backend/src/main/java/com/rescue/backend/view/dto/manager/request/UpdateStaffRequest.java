package com.rescue.backend.view.dto.manager.request;

import java.math.BigDecimal;
import java.util.UUID;

public record UpdateStaffRequest(
        String name,
        String phone,
        String password,
        String role,
        String team_name,
        int team_size,
        BigDecimal latitude,
        BigDecimal longitude
) {
}
