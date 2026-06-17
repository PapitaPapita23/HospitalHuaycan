package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoEscaneadoDto {
    private Long id;
    private Long historiaClinicaId;
    private String nombreArchivo;
    private String urlArchivo;
    private LocalDateTime fechaSubida;
}
