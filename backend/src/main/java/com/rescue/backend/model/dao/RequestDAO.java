package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Request;

import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDAO extends JpaRepository<Request, UUID> {
    Optional<Request> findTopByStatusInAndCitizen_PhoneOrderByCreatedAtDesc(List<String> status, String citizenPhone);
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
        """)
    List<TakeListResponse> getRequestCitizen();
    Optional<Request> findById(UUID id);
    List<Request> findByStatus(String status);
}
