package com.rescue.backend.model.service;

import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.vehicle.request.FilterVehicleRequest;
import com.rescue.backend.view.dto.vehicle.request.SetVehicleRequest;
import com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleDAO vehicleDAO;

    public boolean setVehicle(SetVehicleRequest setVehicleRequest){
        return vehicleDAO.setVehicle(setVehicleRequest.id(), setVehicleRequest.state()) > 0;
    }

    public List<FilterVehicleResponse> filterVehicleByType(FilterVehicleRequest filterVehicleRequest){
        return vehicleDAO.filterVehicleByType(filterVehicleRequest.vehicle_type());
    }
}
