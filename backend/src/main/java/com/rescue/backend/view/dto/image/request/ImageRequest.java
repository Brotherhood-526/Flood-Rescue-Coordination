package com.rescue.backend.view.dto.image.request;

import lombok.Data;

import java.util.UUID;

public record ImageRequest (
        UUID id,
        String imageUrl
) {
}
