package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Message;
import com.rescue.backend.model.dao.MessageDAO;
import com.rescue.backend.view.dto.chat.response.ChatHistoryResponse;
import com.rescue.backend.view.dto.chat.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageDAO messageDAO;

//    public ChatHistoryResponse getChatHistory(UUID requestId) {
//        // Lấy danh sách message từ database
//        List<Message> messages = messageDAO.findByRequestIdOrderBySendAtAsc(requestId);
//
//        List<MessageResponse> messageHistory = messages.stream().map(m -> {
//            // Xác định ID người gửi (lấy cái nào không null)
//            UUID senderId = (m.getSenderUser().getId() != null) ? m.getSenderUser().getId() : m.getSenderStaff().getId();
//
//            // Xác định tên người gửi
//            String senderName = "";
//            if (m.getSenderUser().getId() != null) {
//                senderName = m.getSenderUser().getName();
//            } else if (m.getSenderStaff().getId() != null) {
//                senderName = m.getSenderStaff().getName();
//            }
//
//            return new MessageResponse(
//                    m.getId(),
//                    senderId,
//                    senderName,
//                    m.getSenderRole(),
//                    m.getContent(),
//                    m.getSendAt()
//            );
//        }).toList();
//
//        return new ChatHistoryResponse(messageHistory);
//    }

    public List<MessageResponse> takeAllMessageOfRequest(UUID requestId){

        List<Object[]> rows = messageDAO.findAllMessageRaw(requestId);

        return rows.stream()
                .map(r -> new MessageResponse(
                        toUuid(r[0]),                        // id
                        toUuid(r[1]),                        // senderId
                        (String) r[2],                       // senderName
                        (String) r[3],                       // senderRole
                        (String) r[4],                       // content
                        toLocalDateTime(r[5])                // sendAt
                ))
                .toList();
    }

    private UUID toUuid(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof UUID uuid) {
            return uuid;
        }
        return UUID.fromString(value.toString());
    }

    private LocalDateTime toLocalDateTime(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }
        throw new IllegalArgumentException("Unsupported send_at type: " + value.getClass().getName());
    }
}
