package com.rescue.backend.repository;

import com.rescue.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository  extends JpaRepository<Message, UUID> {
}
