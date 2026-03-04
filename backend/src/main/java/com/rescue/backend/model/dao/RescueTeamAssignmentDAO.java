package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.RescueTeamAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface RescueTeamAssignmentDAO extends JpaRepository<RescueTeamAssignment, UUID> {
    @Query("SELECT a FROM RescueTeamAssignment a WHERE a.rescueTeam.id = :teamId " +
            "AND (:status IS NULL OR a.status = :status)")
    Page<RescueTeamAssignment> findByTeamAndStatus(
            @Param("teamId") UUID teamId,
            @Param("status") String status,
            Pageable pageable);
}
