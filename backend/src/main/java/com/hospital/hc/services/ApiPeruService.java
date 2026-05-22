package com.hospital.hc.services;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hospital.hc.dto.PacienteDTO;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class ApiPeruService {

    private final RestTemplate restTemplate;

    @Value("${apiperu.url}")
    private String apiUrl;

    @Value("${apiperu.token}")
    private String apiToken;

    public ApiPeruService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Optional<PacienteDTO> buscarPorDni(String dni) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");
            headers.set("Authorization", "Bearer " + apiToken);

            Map<String, String> body = new HashMap<>();
            body.put("dni", dni);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<ApiPeruResponse> responseEntity = restTemplate.postForEntity(apiUrl, entity, ApiPeruResponse.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ApiPeruResponse response = responseEntity.getBody();
                if (response.isSuccess() && response.getData() != null) {
                    ApiPeruData data = response.getData();
                    PacienteDTO dto = new PacienteDTO();
                    dto.setDni(dni);
                    dto.setNombre(data.getNombres());
                    
                    // Juntando los apellidos (apellido_paterno y apellido_materno)
                    String apellidoPaterno = data.getApellidoPaterno() != null ? data.getApellidoPaterno().trim() : "";
                    String apellidoMaterno = data.getApellidoMaterno() != null ? data.getApellidoMaterno().trim() : "";
                    
                    String apellidos = (apellidoPaterno + " " + apellidoMaterno).trim();
                    dto.setApellidos(apellidos);
                    
                    return Optional.of(dto);
                }
            }
        } catch (Exception e) {
            log.error("Error al consultar APIPeru para el DNI: {}", dni, e);
        }
        return Optional.empty();
    }

    @Data
    public static class ApiPeruResponse {
        private boolean success;
        private ApiPeruData data;
    }

    @Data
    public static class ApiPeruData {
        private String nombres;
        
        @JsonProperty("apellido_paterno")
        private String apellidoPaterno;
        
        @JsonProperty("apellido_materno")
        private String apellidoMaterno;
    }
}
