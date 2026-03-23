package com.rescue.backend.repositories;

import com.rescue.backend.model.bean.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
}