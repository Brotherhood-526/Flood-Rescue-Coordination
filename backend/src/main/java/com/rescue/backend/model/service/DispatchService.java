package com.rescue.backend.model.service;


import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.coordinator.request.TakeListRequest;
import com.rescue.backend.view.dto.coordinator.request.UpdateMissionReqeuest;
import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;
import com.rescue.backend.view.dto.coordinator.response.TakePageResponse;
import com.rescue.backend.view.dto.vehicle.request.FilterVehicleRequest;
import com.rescue.backend.view.dto.vehicle.response.FilterVehicleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DispatchService {

    @Autowired
    private RequestDAO requestDAO;


    @Autowired
    private VehicleDAO vehicleDAO;

     public  TakePageResponse getRequestCitizen(TakeListRequest takeListRequest){
         Page<TakeListResponse> page =
                 requestDAO.getRequestCitizen(takeListRequest.status(), PageRequest.of(takeListRequest.pageNumber(), takeListRequest.pageSize()));

         return new TakePageResponse(page.getTotalPages(), page.getContent());
     }

    public SpecificResponse getSpecificRequest(UUID id) {
        SpecificResponse response = requestDAO.findRequestDetail(id);

        if (response == null) {
            throw new RuntimeException("Request not found");
        }

        return response;
    }

    @Transactional
    public boolean updateRequest(UpdateMissionReqeuest req){

        int vehicleUpdated =
                vehicleDAO.setVehicle(req.vehicleId(), req.vehicleState());

        if(vehicleUpdated == 0){
            return false;
        }

        int requestUpdated = requestDAO.updateRequest(
                req.id(),
                req.status(),
                req.urgency(),
                req.rescueTeamId(),
                req.vehicleId()
        );

        if(requestUpdated == 0){
            vehicleDAO.setVehicle(req.vehicleId(), "free");
            throw new RuntimeException("Update request failed");
        }

        return true;
    }

    public List<FilterVehicleResponse> filterVehicleByType(FilterVehicleRequest filterVehicleRequest){
        return vehicleDAO.filterVehicleByType(filterVehicleRequest.vehicle_type());
    }
}
