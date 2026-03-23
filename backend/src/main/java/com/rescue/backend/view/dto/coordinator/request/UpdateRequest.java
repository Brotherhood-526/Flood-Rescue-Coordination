package com.rescue.backend.view.dto.coordinator.request;

import java.util.UUID;

public record UpdateRequest(
        String status,
        String urgency,
        UUID rescueTeamID,
        String vehicleType
) {
}
