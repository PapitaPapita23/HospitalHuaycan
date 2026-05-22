package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitaMedicoHU04Dto {
    private Long citaId;
    private LocalTime horaInicio;
    private String estadoConsulta;
    private String pacienteDni;
    private String pacienteNombres;
    private List<AtencionPasadaDto> historialConsultas;
}
