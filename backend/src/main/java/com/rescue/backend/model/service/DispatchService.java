package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.dao.MessageDAO;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.model.dao.VehicleDAO;
import com.rescue.backend.view.dto.coordinator.request.TakeListRequest;
import com.rescue.backend.view.dto.coordinator.request.UpdateMissionRequest;
import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;
import com.rescue.backend.view.dto.coordinator.response.TakePageResponse;
import com.rescue.backend.view.dto.message.request.SpecificMessagesRequest;
import com.rescue.backend.view.dto.message.response.SpecificMessagesResponse;
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

//    @Autowired
//    private MessageDAO messageDAO;

    @Autowired
    private ChatService chatService;

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
    public boolean updateRequest(UpdateMissionRequest req){

        List<Request> requests = requestDAO.findByRescueTeam_Id(req.rescueTeamId());

        boolean usedByCurrentRequest = requests.stream()
                .anyMatch(r -> r.getId().equals(req.id()));

        UUID vehicleId =
                vehicleDAO.findFreeVehicleId(req.rescueTeamId(), req.vehicleType());

        if(vehicleId == null){
            if(usedByCurrentRequest) vehicleId = req.vehicleIdPrevious();
            else return false;
        }

        if(!usedByCurrentRequest){

            int check = vehicleDAO.updateVehicleState(vehicleId, req.vehicleState());
            if(check <= 0) {
                return false;
            }
        }

        int requestUpdated = requestDAO.updateRequest(
                req.id(),
                req.status(),
                req.urgency(),
                req.rescueTeamId(),
                vehicleId
        );

        if(requestUpdated == 0){
            if(!usedByCurrentRequest){
                vehicleDAO.updateVehicleState(vehicleId, "free");
            }
            throw new RuntimeException("Update request failed");
        }

        if(req.vehicleIdPrevious() != null
                && !req.vehicleIdPrevious().equals(vehicleId)) {

            vehicleDAO.updateVehicleState(req.vehicleIdPrevious(), "free");
        }

        return true;
    }

    public boolean rejectRequest(UUID id){
        return requestDAO.rejectRequest(id) > 0;
    }

    public List<FilterVehicleResponse> filterVehicleByType(FilterVehicleRequest filterVehicleRequest){
        return vehicleDAO.filterVehicleByType(filterVehicleRequest.vehicle_type());
    }

    public List<SpecificMessagesResponse> takeAllMessageOfRequest(SpecificMessagesRequest specificMessagesRequest){
         return chatService.takeAllMessageOfRequest(specificMessagesRequest);
    }
}
