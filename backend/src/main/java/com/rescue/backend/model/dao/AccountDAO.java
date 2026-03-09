package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountDAO extends JpaRepository<Staff, UUID> {
    Optional<Staff> findByPhone(String phone);
}
