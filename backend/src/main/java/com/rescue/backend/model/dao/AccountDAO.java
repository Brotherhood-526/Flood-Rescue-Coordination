package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountDAO extends JpaRepository<Account, UUID> {
    Optional<Account> findByPhone(String phone);
}
