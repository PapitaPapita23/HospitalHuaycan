package com.hospital.hc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ConsultaRequestDTO(
    @NotBlank(message = "La anamnesis es obligatoria.")
    String anamnesis,

    @JsonProperty("examen_fisico")
    @NotBlank(message = "El examen físico es obligatorio.")
    String examenFisico,

    @JsonProperty("diagnostico_cie10_principal")
    @NotBlank(message = "El diagnóstico CIE-10 principal es obligatorio.")
    String diagnosticoCie10Principal,

    @JsonProperty("diagnosticos_secundarios")
    List<String> diagnosticosSecundarios,

    @NotBlank(message = "El tratamiento es obligatorio.")
    String tratamiento,

    String indicaciones,

    List<MedicamentoRecetaDTO> medicamentos
) {}
