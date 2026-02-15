package com.rescue.backend.DTOS.rescueTeam.request;

public record UpdateTaskRequest (
    String status,
    String report,
    String citizenId
) {}
