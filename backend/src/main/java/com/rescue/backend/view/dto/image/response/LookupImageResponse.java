package com.rescue.backend.view.dto.image.response;

import java.util.UUID;

public record LookupImageResponse(
        UUID id,
        String imageUrl
) {}