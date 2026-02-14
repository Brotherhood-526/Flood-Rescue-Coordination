package com.rescue.backend.DTOS.auth.request;

public record LoginRequest (
        String phone,
        String password
){
}
