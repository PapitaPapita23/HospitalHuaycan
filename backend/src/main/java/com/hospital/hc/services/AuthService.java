package com.hospital.hc.services;

import com.hospital.hc.dto.AuthResponse;
import com.hospital.hc.dto.LoginRequest;
import com.hospital.hc.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    @SuppressWarnings("unchecked")
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        String rpcUrl = supabaseUrl + "/rest/v1/rpc/login_usuario";

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseAnonKey);
        headers.set("Authorization", "Bearer " + supabaseAnonKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("p_username", loginRequest.getUsername());
        body.put("p_password", loginRequest.getPassword());

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    rpcUrl, new HttpEntity<>(body, headers), Map.class);

            Map<String, Object> userData = response.getBody();
            if (userData == null || userData.get("id") == null) {
                throw new BadCredentialsException("Credenciales inválidas");
            }

            Long userId = Long.valueOf(userData.get("id").toString());
            String nombreCompleto = String.valueOf(userData.getOrDefault("nombre_completo", ""));
            String rol = String.valueOf(userData.getOrDefault("rol", "ROLE_USER"));

            String jwt = jwtUtils.generateJwtToken(userId, loginRequest.getUsername(), rol);
            return new AuthResponse(jwt, userId, loginRequest.getUsername(), nombreCompleto, rol);

        } catch (HttpClientErrorException e) {
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }
}
