package com.rescue.backend.view.dto.manager.request;

import java.util.UUID;

public record UpdateVehicleReqeust(
        String type,
        UUID rescueTeamId
) {
}
