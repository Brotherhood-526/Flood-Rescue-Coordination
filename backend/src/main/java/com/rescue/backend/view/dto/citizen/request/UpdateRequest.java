package com.rescue.backend.view.dto.citizen.request;

import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
@Schema(name ="CitizenUpdateRequest")
public record UpdateRequest(
        UUID requestId,
        String citizenName,
        String citizenPhone,
        String Type,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        String additionLink,
        String description,
        List<MultipartFile> images,
        List<UUID> deleteImageIds
) {
}