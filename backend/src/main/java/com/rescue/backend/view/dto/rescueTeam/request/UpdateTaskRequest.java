package com.rescue.backend.view.dto.rescueTeam.request;

public record UpdateTaskRequest (
        String status,
        String report,
        String citizenId
) {}
