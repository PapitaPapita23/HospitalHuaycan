package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResumenDTO {
    private LocalDate fecha;
    private Long totalCitasHoy;
    private List<ConteoItemDto> citasPorTurnoHoy;
    private List<ConteoItemDto> citasPorEstadoHoy;
    private List<ConteoItemDto> topEspecialidadesHoy;
    private List<ConteoPorFechaDto> citasUltimos7Dias;
    private List<ConteoItemDto> atencionesPorEstadoConsultaHoy;
    private Long totalPacientesActivos;
    private Long totalDocumentosEscaneados;
    private Long totalDocumentosEscaneadosHoy;
    private List<ConteoPorFechaDto> documentosUltimos7Dias;
}
