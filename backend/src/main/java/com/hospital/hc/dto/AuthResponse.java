package com.hospital.hc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String username;
    private String nombreCompleto;
    private String rol;

    public AuthResponse(String token, Long userId, String username, String nombreCompleto, String rol) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
    }
}
