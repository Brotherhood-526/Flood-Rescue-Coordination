package com.rescue.backend.repository;

import com.rescue.backend.model.Request;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestRepository extends JpaRepository<Request, UUID> {
    Optional<Request> findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(List<String> status, String citizenPhone);
}
