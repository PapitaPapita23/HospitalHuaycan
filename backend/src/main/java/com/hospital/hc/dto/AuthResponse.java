package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String nombreCompleto;
    private String rol;

    public AuthResponse(String token, String username, String nombreCompleto, String rol) {
        this.token = token;
        this.username = username;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
    }
}
