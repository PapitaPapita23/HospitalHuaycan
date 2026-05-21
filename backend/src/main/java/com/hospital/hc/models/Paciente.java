package com.hospital.hc.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "paciente", schema = "hospital_hc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8, columnDefinition = "char(8)")
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String apellidos;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false, length = 1, columnDefinition = "char(1)")
    private String genero;

    @Column(length = 15)
    private String telefono;

    @Column(name = "telefono_emergencia", length = 15)
    private String telefonoEmergencia;

    @Column(length = 300)
    private String direccion;

    @Column(length = 100)
    private String distrito;

    @Column(length = 150)
    private String email;

    @Column(name = "grupo_sanguineo", length = 5)
    private String grupoSanguineo;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "estado_sis", nullable = false)
    private Boolean estadoSis = false;

    @Column(name = "num_sis", length = 20)
    private String numSis;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
