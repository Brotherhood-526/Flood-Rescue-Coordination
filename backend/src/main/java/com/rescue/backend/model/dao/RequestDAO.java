package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDAO extends JpaRepository<Request, UUID> {
    Optional<Request> findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(List<String> status, String citizenPhone);

    Page<Request> findByRescueTeamId(UUID teamId, Pageable pageable);

    Page<Request> findByRescueTeamIdAndStatus(UUID teamId, String status, Pageable pageable);
}
