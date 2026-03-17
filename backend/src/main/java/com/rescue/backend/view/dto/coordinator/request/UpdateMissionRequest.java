package com.rescue.backend.view.dto.coordinator.request;

import java.util.UUID;

public record UpdateMissionRequest(
        UUID id,
        String status,
        String urgency,
        UUID rescueTeamId,
        String vehicleType,
        UUID vehicleIdPrevious,
        String vehicleState
) {

}
