package com.rescue.backend.view.dto.manager.request;

import java.math.BigDecimal;

public record CreateStaffRequest(
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
