package com.hospital.hc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record TriajeRequestDTO(
    @NotNull(message = "La frecuencia respiratoria (fr) es obligatoria.")
    @Min(value = 1, message = "La frecuencia respiratoria debe ser mayor a 0.")
    Short fr,

    @NotNull(message = "La frecuencia cardíaca (fc) es obligatoria.")
    @Min(value = 1, message = "La frecuencia cardíaca debe ser mayor a 0.")
    Short fc,

    @NotNull(message = "La temperatura es obligatoria.")
    @DecimalMin(value = "30.0", message = "La temperatura debe ser mayor a 30.0 °C.")
    BigDecimal temperatura,

    @NotNull(message = "La presión arterial sistólica (pa_sistolica) es obligatoria.")
    @JsonProperty("pa_sistolica")
    Short paSistolica,

    @NotNull(message = "La presión arterial diastólica (pa_diastolica) es obligatoria.")
    @JsonProperty("pa_diastolica")
    Short paDiastolica,

    @NotNull(message = "La saturación de oxígeno (spo2) es obligatoria.")
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    BigDecimal spo2,

    @NotNull(message = "El peso es obligatorio.")
    @DecimalMin(value = "0.1", message = "El peso debe ser mayor a 0 kg.")
    BigDecimal peso,

    @NotNull(message = "La talla es obligatoria.")
    @DecimalMin(value = "10.0", message = "La talla debe ser mayor a 10 cm.")
    BigDecimal talla,

    @NotNull(message = "El IMC es obligatorio.")
    @DecimalMin(value = "0.1", message = "El IMC debe ser mayor a 0.")
    BigDecimal imc
) {}
