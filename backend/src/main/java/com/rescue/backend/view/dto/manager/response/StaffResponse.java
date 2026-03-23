package com.rescue.backend.view.dto.manager.response;

import java.util.UUID;

public record StaffResponse(
    UUID id,
    String name,
    String phone,
    String role,
    String state
) {
}
