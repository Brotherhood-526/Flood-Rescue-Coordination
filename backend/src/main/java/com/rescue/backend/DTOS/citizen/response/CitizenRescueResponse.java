package com.rescue.backend.DTOS.citizen.response;

import com.rescue.backend.DTOS.image.response.LookupImageResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class CitizenRescueResponse {
    private UUID requestId;
    private String address;
    private String description;
    private String additionalLink;
    private LocalDateTime createdAt;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String status;
    private String type;
    private String urgency;
    private UUID citizenId;
    private String citizenName;
    private String citizenPhone;
    private List<LookupImageResponse> images;

    private String coordinatorName;
    private String rescueLeaderName;
    private String vehicleType;
}
