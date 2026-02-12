package com.rescue.backend.repository;

import com.rescue.backend.model.Vehicle;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

import java.util.UUID;

public interface VehicleRepository extends JpaRepositoryImplementation<Vehicle, UUID> {
    Vehicle findById(String id);

}
