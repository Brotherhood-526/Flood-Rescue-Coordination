package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Message;
import com.rescue.backend.view.dto.chat.response.MessageResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MessageDAO  extends JpaRepository<Message, UUID> {
    List<Message> findByRequestIdOrderBySendAtAsc(UUID chatId);

    @Query("""
        SELECT new com.rescue.backend.view.dto.chat.response.MessageResponse(
            m.id,
            m.senderId,
            COALESCE(c.name, s.name),
            m.senderRole,
            m.content,
            m.sendAt
        )
        FROM Message m
        LEFT JOIN Citizen c\s
            ON m.senderId = c.id AND m.senderRole = 'người dân'
        LEFT JOIN Staff s\s
            ON m.senderId = s.id\s
            AND m.senderRole IN ('điều phối viên', 'cứu hộ')
        WHERE m.request.id = :requestId
        ORDER BY m.sendAt
   \s""")
    List<MessageResponse> findAllMessageOfRequestId(UUID requestId);
}
