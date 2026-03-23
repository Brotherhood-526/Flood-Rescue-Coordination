package com.rescue.backend.view.dto.chat.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record SendMessageRequest (
        UUID requestId,
        String senderRole,
        String content,
        UUID senderId,
        LocalDateTime sendAt
){
}
