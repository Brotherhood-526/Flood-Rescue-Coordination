package com.rescue.backend.view.dto.chat.response;

import java.util.List;

public record ChatHistoryResponse (
    List<MessageResponse> messages
){
}
