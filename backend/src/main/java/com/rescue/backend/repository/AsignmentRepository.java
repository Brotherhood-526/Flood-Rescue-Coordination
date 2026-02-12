package com.rescue.backend.repository;

import com.rescue.backend.model.RescueTeamAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AsignmentRepository extends JpaRepository<RescueTeamAssignment, UUID> {
}
