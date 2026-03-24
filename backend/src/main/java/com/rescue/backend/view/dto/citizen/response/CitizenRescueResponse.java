package com.rescue.backend.view.dto.citizen.response;

import com.rescue.backend.view.dto.image.response.LookupImageResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CitizenRescueResponse (
    UUID requestId,
    String address,
    String description,
    String additionalLink,
    LocalDateTime createdAt,
    BigDecimal latitude,
    BigDecimal longitude,
    String status,
    String type,
    String urgency,
    UUID citizenId,
    String citizenName,
    String citizenPhone,
    List<LookupImageResponse> images,

    String coordinatorName,
    String rescueLeaderName,
    String vehicleType
){}
