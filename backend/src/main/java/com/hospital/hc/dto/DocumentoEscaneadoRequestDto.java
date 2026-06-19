package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoEscaneadoRequestDto {
    private Long historiaClinicaId;
    private String nombreArchivo;
    private String urlArchivo;
}
