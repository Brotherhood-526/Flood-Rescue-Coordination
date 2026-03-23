package com.rescue.backend.view.dto.manager.request;

import java.util.UUID;

public record CreateVehicleRequest(
        String type,
        UUID rescueTeamId
) {
}
