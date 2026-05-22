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
public class AtencionPasadaDto {
    private LocalDate fechaAtencion;
    
    // Triaje y Signos Vitales
    private Short fr;
    private Short fc;
    private java.math.BigDecimal temperatura;
    private Short paSistolica;
    private Short paDiastolica;
    private java.math.BigDecimal spo2;
    private java.math.BigDecimal peso;
    private java.math.BigDecimal talla;
    private java.math.BigDecimal imc;
    private Short escalaDolor;
    
    // Consulta y Plan
    private String anamnesis;
    private String examenFisico;
    private String diagnosticoCie10Principal;
    private String diagnosticoDescripcion;
    private String diagnosticosSecundarios;
    private String tratamiento;
    private String indicaciones;
    private String solicitudExamenes;
}
