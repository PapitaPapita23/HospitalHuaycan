package com.hospital.hc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConteoItemDto {
    private String etiqueta;
    private Long total;
}
