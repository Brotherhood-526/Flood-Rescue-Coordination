package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Request;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDAO extends JpaRepository<Request, UUID> {
    Optional<Request> findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(List<String> status, String citizenPhone);
}
