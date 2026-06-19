package com.hospital.hc.controllers;

import com.hospital.hc.dto.CitaMedicoHU04Dto;
import com.hospital.hc.dto.AtencionPasadaDto;
import com.hospital.hc.dto.ConsultaRequestDTO;
import com.hospital.hc.dto.TriajeRequestDTO;
import com.hospital.hc.models.AtencionMedica;
import com.hospital.hc.models.Cie10;
import com.hospital.hc.services.AtencionMedicaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AtencionMedicaController {

    private final AtencionMedicaService atencionMedicaService;

    // Inyección de dependencias por constructor
    public AtencionMedicaController(AtencionMedicaService atencionMedicaService) {
        this.atencionMedicaService = atencionMedicaService;
    }

    /**
     * Obtener todas las citas del día de hoy para el dashboard de triaje de enfermería.
     */
    @GetMapping("/atenciones/agenda-hoy")
    public ResponseEntity<List<CitaMedicoHU04Dto>> obtenerAgendaHoyTodo() {
        List<CitaMedicoHU04Dto> agenda = atencionMedicaService.obtenerAgendaHoyTodo();
        return ResponseEntity.ok(agenda);
    }

    /**
     * HU05: Registrar Triaje de paciente.
     * Recibe los signos vitales, registra la enfermera que lo realizó, el timestamp y
     * cambia el estado de la atención a 'EN_CONSULTA'.
     */
    @PutMapping("/atenciones/{id}/triaje")
    public ResponseEntity<?> registrarTriaje(
            @PathVariable("id") Long id,
            @RequestBody @Valid TriajeRequestDTO dto,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }
        try {
            String username = principal.getName();
            AtencionMedica atencion = atencionMedicaService.registrarTriaje(id, dto, username);
            return ResponseEntity.ok(java.util.Map.of(
                "id", atencion.getId(),
                "estadoConsulta", atencion.getEstadoConsulta(),
                "message", "Triaje registrado correctamente"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * HU06 y HU07: Registrar Datos de Consulta Médica, Diagnósticos y Receta Médica.
     * Valida el código CIE-10 principal, serializa los diagnósticos secundarios a JSON
     * y genera registros en receta_medica si aplica.
     */
    @PutMapping("/atenciones/{id}/consulta")
    public ResponseEntity<?> registrarConsulta(
            @PathVariable("id") Long id,
            @RequestBody @Valid ConsultaRequestDTO dto) {
        try {
            AtencionMedica atencion = atencionMedicaService.registrarConsulta(id, dto);
            return ResponseEntity.ok(java.util.Map.of(
                "id", atencion.getId(),
                "estadoConsulta", atencion.getEstadoConsulta(),
                "message", "Consulta registrada correctamente"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    /**
     * Obtener el historial de atenciones médicas pasadas del paciente.
     */
    @GetMapping("/historias/{historiaClinicaId}/atenciones")
    public ResponseEntity<List<AtencionPasadaDto>> obtenerHistorial(
            @PathVariable("historiaClinicaId") Long historiaClinicaId) {
        List<AtencionPasadaDto> historial = atencionMedicaService.obtenerHistorial(historiaClinicaId);
        return ResponseEntity.ok(historial);
    }

    /**
     * Buscar enfermedades por código o descripción en el catálogo CIE-10 (solo activos).
     */
    @GetMapping("/cie10/buscar")
    public ResponseEntity<List<Cie10>> buscarCie10(@RequestParam("query") String query) {
        List<Cie10> diagnosticos = atencionMedicaService.buscarCie10(query);
        return ResponseEntity.ok(diagnosticos);
    }
}
