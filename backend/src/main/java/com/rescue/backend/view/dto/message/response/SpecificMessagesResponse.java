package com.rescue.backend.view.dto.message.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record SpecificMessagesResponse(
        UUID id,
        String senderRole,
        String content,
        LocalDateTime sendAt,
        String senderName
){

}
