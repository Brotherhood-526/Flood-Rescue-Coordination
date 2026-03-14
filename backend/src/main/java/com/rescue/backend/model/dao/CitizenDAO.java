package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CitizenDAO extends JpaRepository<Citizen, UUID> {
    Optional<Citizen> findByPhone(String phone);
}