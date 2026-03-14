package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Vehicle;
import com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface VehicleDAO extends JpaRepositoryImplementation<Vehicle, UUID> {
    Vehicle findById(String id);

    @Modifying
    @Transactional
    @Query("UPDATE Vehicle v SET v.state = :state WHERE v.id = :id AND v.state = 'free'")
    int setVehicle(UUID id, String state);

    @Query("""
            SELECT new com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse(
                v.id,
                v.type,
                s.id,
                s.name
            )
            FROM Vehicle v
            JOIN v.staff s
            WHERE v.type = :type
            AND v.state = 'free'
            """)
    List<FilterVehicleResponse> filterVehicleByType(String type);
}
