package com.rescue.backend.view.dto.rescueTeam.response;

import com.rescue.backend.view.dto.image.response.LookupImageResponse;

import java.util.List;
import java.util.UUID;

public record TaskDetailResponse (
        UUID assignmentId,
        UUID requestId,
        UUID citizenId,
        String citizenName,
        String citizenPhone,
        String urgency,
        String address,
        Double latitude,
        Double longitude,
        String vehicleType,
        String description,
        String coordinatorName,
        String createdAt,
        List<LookupImageResponse> images
){

}
