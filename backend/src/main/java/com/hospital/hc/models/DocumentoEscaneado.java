package com.hospital.hc.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "documento_escaneado", schema = "hospital_hc")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoEscaneado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "historia_clinica_id", nullable = false)
    private HistoriaClinica historiaClinica;

    @Column(name = "nombre_archivo", nullable = false)
    private String nombreArchivo;

    @Column(name = "url_archivo", nullable = false, columnDefinition = "TEXT")
    private String urlArchivo;

    @Column(name = "fecha_subida", nullable = false, updatable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();
}
