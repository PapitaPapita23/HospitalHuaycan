package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConteoPorFechaDto {
    private LocalDate fecha;
    private Long total;
}
