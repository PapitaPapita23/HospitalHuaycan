package com.hospital.hc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaRequestDTO {
    @JsonProperty("paciente_id")
    private Long pacienteId;

    @JsonProperty("medico_id")
    private Integer medicoId;

    @JsonProperty("especialidad_id")
    private Integer especialidadId;

    @JsonProperty("fecha_cita")
    private LocalDate fechaCita;

    private String turno; // Debe ser 'MANANA' o 'TARDE'
}
