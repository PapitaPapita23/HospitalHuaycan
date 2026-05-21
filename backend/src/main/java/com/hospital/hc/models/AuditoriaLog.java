package com.hospital.hc.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_log", schema = "hospital_hc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditoriaLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, length = 50)
    private String accion;

    @Column(name = "tabla_afectada", length = 100)
    private String tablaAfectada;

    @Column(name = "registro_id")
    private Long registroId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "datos_anteriores")
    private String datosAnteriores;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "datos_nuevos")
    private String datosNuevos;

    @Column(name = "ip_origen", columnDefinition = "inet")
    private String ipOrigen;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
