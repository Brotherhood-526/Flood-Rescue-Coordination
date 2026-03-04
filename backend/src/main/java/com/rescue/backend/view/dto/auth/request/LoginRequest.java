package com.rescue.backend.view.dto.auth.request;

public record LoginRequest (
        String phone,
        String password
){
}
