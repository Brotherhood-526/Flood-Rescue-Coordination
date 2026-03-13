package com.rescue.backend.view.dto.coordinator.request;

public record TakeListRequest (
    int pageSize,
    int pageNumber,
    String status
){
}
