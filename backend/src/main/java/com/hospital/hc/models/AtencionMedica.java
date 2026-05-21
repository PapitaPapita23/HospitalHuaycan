package com.hospital.hc.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "atencion_medica", schema = "hospital_hc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtencionMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cita_id", nullable = false, unique = true)
    private CitaMedica cita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "historia_clinica_id", nullable = false)
    private HistoriaClinica historiaClinica;

    @Column(name = "fecha_atencion", nullable = false)
    private LocalDate fechaAtencion = LocalDate.now();

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    // === DATOS DE TRIAJE (Enfermería) ===
    private Short fr; // Frecuencia Respiratoria (rpm)
    private Short fc; // Frecuencia Cardíaca (lpm)

    @Column(precision = 4, scale = 1)
    private BigDecimal temperatura; // Temperatura °C

    @Column(name = "pa_sistolica")
    private Short paSistolica; // Presión Arterial Sistólica (mmHg)

    @Column(name = "pa_diastolica")
    private Short paDiastolica; // Presión Arterial Diastólica (mmHg)

    @Column(precision = 5, scale = 2)
    private BigDecimal spo2; // Saturación O2 (%)

    @Column(precision = 5, scale = 2)
    private BigDecimal peso; // Peso (kg)

    @Column(precision = 5, scale = 2)
    private BigDecimal talla; // Talla (cm)

    @Column(precision = 5, scale = 2)
    private BigDecimal imc; // IMC calculado

    @Column(name = "escala_dolor")
    private Short escalaDolor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "triaje_realizado_por")
    private Usuario triajeRealizadoPor;

    @Column(name = "triaje_fecha_hora")
    private LocalDateTime triajeFechaHora;

    // === DATOS DE CONSULTA MÉDICA ===
    @Column(columnDefinition = "TEXT")
    private String anamnesis;

    @Column(name = "examen_fisico", columnDefinition = "TEXT")
    private String examenFisico;

    @Column(name = "diagnostico_cie10_principal", length = 10)
    private String diagnosticoCie10Principal;

    @Column(name = "diagnostico_descripcion", columnDefinition = "TEXT")
    private String diagnosticoDescripcion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "diagnosticos_secundarios")
    private String diagnosticosSecundarios; // JSONB String representation of secondary diagnostics array

    @Column(columnDefinition = "TEXT")
    private String tratamiento;

    @Column(columnDefinition = "TEXT")
    private String indicaciones;

    @Column(name = "solicitud_examenes", columnDefinition = "TEXT")
    private String solicitudExamenes;

    @Column(length = 200)
    private String derivacion;

    @Column(name = "proxima_cita")
    private LocalDate proximaCita;

    @Column(name = "estado_consulta", nullable = false, length = 15)
    private String estadoConsulta = "PENDIENTE";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    private Medico medico;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
