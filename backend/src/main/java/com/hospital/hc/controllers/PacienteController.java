package com.hospital.hc.controllers;

import com.hospital.hc.dto.PacienteDTO;
import com.hospital.hc.models.Paciente;
import com.hospital.hc.repositories.PacienteRepository;
import com.hospital.hc.services.ApiPeruService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ApiPeruService apiPeruService;

    @GetMapping("/buscar")
    public ResponseEntity<PacienteDTO> buscarPorDni(@RequestParam("dni") String dni) {
        // Paso A: Busca el DNI en la base de datos local
        Optional<Paciente> pacienteOpt = pacienteRepository.findByDni(dni);
        if (pacienteOpt.isPresent()) {
            Paciente p = pacienteOpt.get();
            PacienteDTO dto = new PacienteDTO(p.getId(), p.getDni(), p.getNombre(), p.getApellidos());
            return ResponseEntity.ok(dto);
        }

        // Paso B y C: Llama a ApiPeruService si no existe en BD local
        // Si se encuentra en APIPeru, se guarda automáticamente en la base de datos local
        return apiPeruService.buscarPorDni(dni)
                .map(dto -> {
                    Paciente paciente = new Paciente();
                    paciente.setDni(dto.getDni());
                    paciente.setNombre(dto.getNombre());
                    paciente.setApellidos(dto.getApellidos());
                    // Valores por defecto requeridos por la base de datos para no violar restricciones NOT NULL
                    paciente.setFechaNacimiento(LocalDate.of(1900, 1, 1));
                    paciente.setGenero("O");
                    paciente.setEstadoSis(false);
                    paciente.setActivo(true);
                    paciente.setCreatedAt(LocalDateTime.now());
                    paciente.setUpdatedAt(LocalDateTime.now());

                    Paciente guardado = pacienteRepository.save(paciente);
                    dto.setId(guardado.getId());
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<PacienteDTO> registrarPaciente(@RequestBody PacienteDTO dto) {
        if (pacienteRepository.findByDni(dto.getDni()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Paciente paciente = new Paciente();
        paciente.setDni(dto.getDni());
        paciente.setNombre(dto.getNombre());
        paciente.setApellidos(dto.getApellidos());
        // Valores por defecto requeridos por la base de datos para no violar restricciones NOT NULL
        paciente.setFechaNacimiento(LocalDate.of(1900, 1, 1));
        paciente.setGenero("O");
        paciente.setEstadoSis(false);
        paciente.setActivo(true);
        paciente.setCreatedAt(LocalDateTime.now());
        paciente.setUpdatedAt(LocalDateTime.now());

        Paciente guardado = pacienteRepository.save(paciente);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new PacienteDTO(guardado.getId(), guardado.getDni(), guardado.getNombre(), guardado.getApellidos()));
    }
}
