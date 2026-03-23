package com.rescue.backend.view.dto.image.response;

import java.util.UUID;

public record CoordinatorImageResponse(
        UUID id,
        String imageUrl
) {
}
