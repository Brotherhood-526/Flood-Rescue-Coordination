package com.rescue.backend.model.service;

import com.rescue.backend.model.bean.Request;
import com.rescue.backend.model.dao.RequestDAO;
import com.rescue.backend.view.dto.coordinator.request.TakeListRequest;
import com.rescue.backend.view.dto.coordinator.response.SpecificResponse;
import com.rescue.backend.view.dto.coordinator.response.TakeListResponse;
import com.rescue.backend.view.dto.coordinator.response.TakePageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DispatchService {

    @Autowired
    private RequestDAO requestDAO;

     public  TakePageResponse getRequestCitizen(TakeListRequest takeListRequest){
         Page<TakeListResponse> page =
                 requestDAO.getRequestCitizen(takeListRequest.status(), PageRequest.of(takeListRequest.pageNumber(), takeListRequest.pageSize()));

         return new TakePageResponse(page.getTotalPages(), page.getContent());
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
}
