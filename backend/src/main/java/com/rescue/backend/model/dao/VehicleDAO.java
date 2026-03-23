package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Staff;
import com.rescue.backend.model.bean.Vehicle;
import com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleDAO extends JpaRepositoryImplementation<Vehicle, UUID> {
    Optional<Vehicle> findById(UUID id);

    List<Vehicle> findByStaff_Id(UUID rescueTeamId);

    @Query("""
        SELECT v.id
        FROM Vehicle v
        WHERE v.staff.id = :staffId
        AND v.state = 'free'
        AND v.type = :type
    """)
    UUID findFreeVehicleId(UUID staffId, String type);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE Vehicle
        SET state = :state
        WHERE id = :vehicleId
    """, nativeQuery = true)
    int updateVehicleState(UUID vehicleId, String state);

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
            AND v.state = 'không hoạt động'
            """)
    List<FilterVehicleResponse> filterVehicleByType(String type);

    Page<Vehicle> findAllByType(String type, Pageable pageable);

    @Query("""
                SELECT v FROM Vehicle v
                WHERE LOWER(v.staff.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(v.type) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<Vehicle> searchVehicle(@Param("keyword") String keyword, Pageable pageable);

}
