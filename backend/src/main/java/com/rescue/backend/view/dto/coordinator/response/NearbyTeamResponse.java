package com.rescue.backend.view.dto.coordinator.response;

import java.util.UUID;

public record NearbyTeamResponse(
        UUID id,
        String teamName
) {
}
