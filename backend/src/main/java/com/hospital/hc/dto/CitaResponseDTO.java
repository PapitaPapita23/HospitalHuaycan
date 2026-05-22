package com.hospital.hc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaResponseDTO {
    private PacienteDTO paciente;

    private String medico; // Nombre completo del médico

    private String especialidad; // Nombre de la especialidad

    @JsonProperty("fecha_cita")
    private LocalDate fechaCita;

    private String turno;

    @JsonProperty("numero_ticket")
    private String numeroTicket;
}
