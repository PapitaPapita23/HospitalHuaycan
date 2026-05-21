package com.hospital.hc.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "receta_medica", schema = "hospital_hc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecetaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atencion_id", nullable = false)
    private AtencionMedica atencion;

    @Column(nullable = false, length = 200)
    private String medicamento;

    @Column(length = 50)
    private String concentracion;

    @Column(name = "forma_farmaceutica", length = 50)
    private String formaFarmaceutica;

    @Column(nullable = false, length = 100)
    private String dosis;

    @Column(nullable = false, length = 100)
    private String frecuencia;

    @Column(name = "duracion_dias")
    private Short duracionDias;

    @Column(name = "indicaciones_especiales", columnDefinition = "TEXT")
    private String indicacionesEspeciales;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
