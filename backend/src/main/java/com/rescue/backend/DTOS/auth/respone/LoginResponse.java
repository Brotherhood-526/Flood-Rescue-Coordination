package com.rescue.backend.DTOS.auth.respone;

import java.math.BigDecimal;
import java.util.UUID;

public record LoginResponse (
    UUID accountId,
    String phone,
    String role,
    String name,
    String teamName,
    Integer teamSize,
    BigDecimal latitude,
    BigDecimal longitude
){
}
