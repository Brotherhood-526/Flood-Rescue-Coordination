package com.rescue.backend.view.dto.vehicle.request;

import java.util.UUID;

public record SetVehicleRequest(
        UUID id,
        String state
) {
}
