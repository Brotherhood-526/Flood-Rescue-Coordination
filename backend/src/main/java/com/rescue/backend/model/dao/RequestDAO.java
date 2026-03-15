package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Request;

import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;

import jakarta.annotation.Nonnull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDAO extends JpaRepository<Request, UUID> {

    Optional<Request> findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(
            List<String> status, String citizenPhone
    );

    Optional<Request> findById(@Nonnull UUID requestId);

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

    @Query("""
    SELECT new com.rescue.backend.view.dto.coordinator.response.SpecificResponse(
        r.id,
        r.type,
        r.description,
        r.address,
        r.latitude,
        r.longitude,
        r.additionalLink,
        r.status,
        r.createdAt,
        r.urgency,
        s.id,
        s.teamName,
        v.id,
        v.type
    )
    FROM Request r
    LEFT JOIN r.rescueTeam s
    LEFT JOIN r.vehicle v
    WHERE r.id = :id
    """)
    SpecificResponse findRequestDetail(UUID id);

    @Modifying
    @Transactional
    @Query("""
    UPDATE Request r
    SET r.status = :status,
        r.urgency = :urgency,
        r.rescueTeam.id = :rescueTeamId,
        r.vehicle.id = :vehicleId
    WHERE r.id = :requestId
    AND r.status <> 'completed'
    """)
    int updateRequest(
            UUID requestId,
            String status,
            String urgency,
            UUID rescueTeamId,
            UUID vehicleId
    );

    Page<Request> findByRescueTeamId(UUID teamId, Pageable pageable);

    Page<Request> findByRescueTeamIdAndStatus(UUID teamId, String status, Pageable pageable);

    Optional<Request> findByRescueTeamIdAndId(UUID rescueTeamId, UUID id);

    Optional<Request> findByRescueTeamId(UUID rescueTeamId);
}