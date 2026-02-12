package com.rescue.backend.repository;

import com.rescue.backend.model.Citizen;

import com.rescue.backend.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CitizenRepository extends JpaRepository<Citizen, UUID> {
    Optional<Citizen> findByPhone(String phone);

}
