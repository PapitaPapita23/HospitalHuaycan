package com.hospital.hc.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cie10", schema = "hospital_hc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cie10 {

    @Id
    @Column(length = 10)
    private String codigo;

    @Column(nullable = false, length = 300)
    private String descripcion;

    @Column(length = 10)
    private String categoria;

    @Column(nullable = false)
    private Boolean activo = true;
}
