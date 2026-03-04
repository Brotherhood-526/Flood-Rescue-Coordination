package com.rescue.backend.model.dao;

import com.rescue.backend.model.bean.Vehicle;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

import java.util.UUID;

public interface VehicleDAO extends JpaRepositoryImplementation<Vehicle, UUID> {
    Vehicle findById(String id);

}
