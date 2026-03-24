package com.rescue.backend.view.dto.coordinator.response;

import com.rescue.backend.view.dto.image.response.CoordinatorImageResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record RequestDetailResponse(
        UUID id,
        String status,
        String urgency,

        // Người yêu cầu
        String citizenName,
        String phone,

        // Vị trí
        String address,
        BigDecimal latitude,
        BigDecimal longitude,

        // Mô tả & ảnh
        String description,
        String additionalLink,
        List<CoordinatorImageResponse> images,

        String vehicleType,
        String rescueTeamName,

        BigDecimal rescueTeamLatitude,
        BigDecimal rescueTeamLongitude
) {
}
