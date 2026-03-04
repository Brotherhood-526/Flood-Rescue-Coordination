package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageDAO  extends JpaRepository<Message, UUID> {
    List<Message> findByRequestIdOrderBySendAtAsc(UUID chatId);
}
