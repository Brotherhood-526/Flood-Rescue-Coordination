package com.rescue.backend.view.dto.coordinator.request;

import java.util.UUID;

public record UpdateMissionReqeuest(
        UUID id,
        String status,
        String urgency,
        UUID rescueTeamId,
        UUID vehicleId,
        String vehicleState
) {

}
