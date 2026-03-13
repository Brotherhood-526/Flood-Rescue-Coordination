package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDAO extends JpaRepository<Request, UUID> {

    Optional<Request> findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
            List<String> status, String citizenPhone
    );

    @Query("""
    SELECT new com.rescue.backend.view.dto.coordinator.response.TakeListResponse(
        r.id,
        c.phone,
        c.name,
        r.status,
        r.createdAt
    )
    FROM Request r
    JOIN r.citizen c
    WHERE (:status IS NULL OR :status = '' OR r.status = :status)
    ORDER BY r.createdAt DESC
""")
    Page<TakeListResponse> getRequestCitizen(String status, Pageable pageable);

    Page<Request> findByRescueTeamId(UUID teamId, Pageable pageable);

    Page<Request> findByRescueTeamIdAndStatus(UUID teamId, String status, Pageable pageable);
}