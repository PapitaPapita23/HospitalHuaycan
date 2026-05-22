package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteBusquedaHU03Dto {
    private Long pacienteId;
    private String dni;
    private String nombres;
    private String apellidos;
    private String genero;
    private Integer edad;
    private String grupoSanguineo;
    private String alergias;
    private Boolean estadoSis;
    private Long historiaClinicaId;
    private LocalDate fechaCreacionExpediente;
}
