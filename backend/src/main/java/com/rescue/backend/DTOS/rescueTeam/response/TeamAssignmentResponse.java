package com.rescue.backend.DTOS.rescueTeam.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TeamAssignmentResponse {
    private UUID id;
    private String citizenPhone;
    private String status;
    private LocalDateTime createdAt;
}
