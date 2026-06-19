package com.hospital.hc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record MedicamentoRecetaDTO(
    @NotBlank(message = "El medicamento es obligatorio.")
    String medicamento,

    String concentracion,

    @JsonProperty("forma_farmaceutica")
    String formaFarmaceutica,

    @NotBlank(message = "La dosis es obligatoria.")
    String dosis,

    @NotBlank(message = "La frecuencia es obligatoria.")
    String frecuencia,

    @JsonProperty("duracion_dias")
    Short duracionDias,

    @JsonProperty("indicaciones_especiales")
    String indicacionesEspeciales
) {}
