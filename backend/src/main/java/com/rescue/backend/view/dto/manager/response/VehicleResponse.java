package com.rescue.backend.view.dto.manager.response;

import java.util.UUID;

public record VehicleResponse(
    UUID id,
    String type,
    String team_owner,
    String state
) {
}
