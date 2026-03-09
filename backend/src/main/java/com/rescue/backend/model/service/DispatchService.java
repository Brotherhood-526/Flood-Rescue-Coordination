package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.view.dto.coordinator.request.FilterRequest;
import com.rescue.backend.view.dto.coordinator.request.TakeListRequest;
import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DispatchService {

    @Autowired
    private RequestDAO requestDAO;

     public  List<TakeListResponse> getRequestCitizen(TakeListRequest takeListRequest){
         return requestDAO.getRequestCitizen();
     }

     public SpecificResponse getSpecificRequest(UUID id){
         Request request = requestDAO.findById(id)
                 .orElseThrow(() -> new RuntimeException("Request not found"));

         return new SpecificResponse(
                 request.getId(),
                 request.getType(),
                 request.getDescription(),
                 request.getAddress(),
                 request.getLatitude(),
                 request.getLongitude(),
                 request.getAdditionalLink(),
                 request.getStatus(),
                 request.getCreatedAt()
         );
     }

     public List<TakeListResponse> filterRequestCitizen(FilterRequest filterRequest){
         List<Request> requests = requestDAO.findByStatus(filterRequest.status());

         return requests.stream()
                 .map(r -> new TakeListResponse(
                         r.getId(),
                         r.getCitizen().getPhone(),
                         r.getCitizen().getName(),
                         r.getStatus(),
                         r.getCreatedAt()
                 ))
                 .toList();
     }
}
