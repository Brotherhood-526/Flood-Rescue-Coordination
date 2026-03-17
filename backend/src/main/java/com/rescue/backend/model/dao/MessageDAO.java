package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Message;
import com.rescue.backend.view.dto.message.response.SpecificMessagesResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MessageDAO  extends JpaRepository<Message, UUID> {
    List<Message> findByRequestIdOrderBySendAtAsc(UUID chatId);

    @Query("""
            SELECT new com.rescue.backend.view.dto.message.response.SpecificMessagesResponse(
                m.id,
                m.senderRole,
                m.content,
                m.sendAt,
                COALESCE(c.name, s.name) as senderName
            )
            FROM Message m
            LEFT JOIN Citizen c ON m.senderId = c.id
            LEFT JOIN Staff s ON m.senderId = s.id
            WHERE m.request.id = :request_id
            ORDER BY m.sendAt
        """)
    List<SpecificMessagesResponse> findAllMessageOfRequestId(UUID request_id);
}
