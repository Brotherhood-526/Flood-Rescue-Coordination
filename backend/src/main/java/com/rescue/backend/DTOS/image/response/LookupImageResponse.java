package com.rescue.backend.DTOS.image.response;

import java.util.UUID;

public record LookupImageResponse(
        UUID id,
        String imageUrl
) {}