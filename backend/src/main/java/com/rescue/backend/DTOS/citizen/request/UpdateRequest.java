package com.rescue.backend.DTOS.citizen.request;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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