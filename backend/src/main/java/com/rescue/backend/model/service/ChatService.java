package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Message;
import com.rescue.backend.model.dao.MessageDAO;
import com.rescue.backend.view.dto.chat.request.ChatHistoryRequest;
import com.rescue.backend.view.dto.chat.response.ChatHistoryResponse;
import com.rescue.backend.view.dto.chat.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageDAO messageDAO;

    public ChatHistoryResponse getChatHistory (UUID requestId) {
        List<Message> messages = messageDAO.findByRequestIdOrderBySendAtAsc(requestId);

        List<MessageResponse> messageHistory = messages.stream().map(m -> new MessageResponse(
            m.getId(), m.getSenderId(), m.getSenderName(), m.getSenderRole(), m.getContent(), m.getSendAt()
        )).toList();


        return new ChatHistoryResponse(messageHistory);
    }

}
