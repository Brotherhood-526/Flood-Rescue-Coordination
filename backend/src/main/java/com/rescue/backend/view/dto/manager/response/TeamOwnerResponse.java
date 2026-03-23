package com.rescue.backend.view.dto.manager.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

public record TeamOwnerResponse(UUID id, String leaderName) {}