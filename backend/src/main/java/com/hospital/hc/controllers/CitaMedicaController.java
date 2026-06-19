package com.hospital.hc.controllers;

import com.hospital.hc.dto.CitaRequestDTO;
import com.hospital.hc.dto.CitaResponseDTO;
import com.hospital.hc.dto.PacienteDTO;
import com.hospital.hc.models.CitaMedica;
import com.hospital.hc.models.Paciente;
import com.hospital.hc.models.Medico;
import com.hospital.hc.models.Especialidad;
import com.hospital.hc.models.Usuario;
import com.hospital.hc.repositories.CitaMedicaRepository;
import com.hospital.hc.repositories.PacienteRepository;
import com.hospital.hc.repositories.MedicoRepository;
import com.hospital.hc.repositories.EspecialidadRepository;
import com.hospital.hc.repositories.UsuarioRepository;
import com.hospital.hc.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/citas")
public class CitaMedicaController {

    @Autowired
    private CitaMedicaRepository citaMedicaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<?> obtenerCitas(
            @RequestParam(value = "fecha", required = false) String fechaStr) {
        LocalDate fecha = fechaStr != null ? LocalDate.parse(fechaStr) : LocalDate.now();
        java.util.List<CitaMedica> citas = citaMedicaRepository.findByFechaCitaOrderByHoraCitaAsc(fecha);
        
        java.util.List<java.util.Map<String, Object>> response = citas.stream().map(cita -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", cita.getNumeroTicket() != null ? cita.getNumeroTicket() : "CITA-" + cita.getId());
            map.put("citaId", cita.getId());
            map.put("paciente", cita.getPaciente().getNombre() + " " + cita.getPaciente().getApellidos());
            map.put("dni", cita.getPaciente().getDni());
            map.put("especialidad", cita.getEspecialidad().getNombre());
            map.put("medico", cita.getMedico().getNombreCompleto());
            map.put("turno", cita.getTurno());
            map.put("fecha", cita.getFechaCita().toString());
            map.put("estado", cita.getEstado());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> agendarCita(@RequestBody CitaRequestDTO dto) {
        // 1. Validar IDs no nulos
        if (dto.getPacienteId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El ID del paciente es obligatorio.");
        }
        if (dto.getMedicoId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El ID del médico es obligatorio.");
        }
        if (dto.getEspecialidadId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El ID de la especialidad es obligatorio.");
        }

        // 2. Validar Paciente
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElse(null);
        if (paciente == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El paciente con ID " + dto.getPacienteId() + " no existe.");
        }

        // 3. Validar Médico
        Medico medico = medicoRepository.findById(dto.getMedicoId())
                .orElse(null);
        if (medico == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El médico con ID " + dto.getMedicoId() + " no existe.");
        }

        // 4. Validar Especialidad
        Especialidad especialidad = especialidadRepository.findById(dto.getEspecialidadId())
                .orElse(null);
        if (especialidad == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: La especialidad con ID " + dto.getEspecialidadId() + " no existe.");
        }

        // 4. Obtener usuario creador desde la seguridad
        Usuario creador = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            creador = usuarioRepository.findById(userDetails.getId()).orElse(null);
        }

        // 5. Crear la cita
        CitaMedica cita = new CitaMedica();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setEspecialidad(especialidad);
        cita.setFechaCita(dto.getFechaCita());
        cita.setTurno(dto.getTurno());
        cita.setEstado("PENDIENTE");
        cita.setTipoCita("NORMAL");
        cita.setCreador(creador);
        cita.setCreatedAt(LocalDateTime.now());
        cita.setUpdatedAt(LocalDateTime.now());

        // Asignar hora por defecto según turno
        if ("MANANA".equalsIgnoreCase(dto.getTurno())) {
            cita.setHoraCita(LocalTime.of(8, 0));
        } else {
            cita.setHoraCita(LocalTime.of(14, 0));
        }

        // 6. Generar número de ticket único
        String numeroTicket;
        do {
            numeroTicket = "TKT-" + String.format("%06d", (int) (Math.random() * 1000000));
        } while (citaMedicaRepository.existsByNumeroTicket(numeroTicket));
        cita.setNumeroTicket(numeroTicket);

        // 7. Guardar en base de datos
        CitaMedica guardada = citaMedicaRepository.save(cita);

        // 8. Construir respuesta
        PacienteDTO pacienteDTO = new PacienteDTO(
                paciente.getId(),
                paciente.getDni(),
                paciente.getNombre(),
                paciente.getApellidos()
        );

        CitaResponseDTO response = new CitaResponseDTO(
                pacienteDTO,
                medico.getNombreCompleto(),
                especialidad.getNombre(),
                guardada.getFechaCita(),
                guardada.getTurno(),
                guardada.getNumeroTicket()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
