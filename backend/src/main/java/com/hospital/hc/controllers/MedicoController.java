package com.hospital.hc.controllers;

import com.hospital.hc.dto.MedicoDTO;
import com.hospital.hc.repositories.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    @Autowired
    private MedicoRepository medicoRepository;

    @GetMapping
    public List<MedicoDTO> listarPorEspecialidad(@RequestParam("especialidadId") Integer especialidadId) {
        return medicoRepository.findByEspecialidadIdAndActivoTrue(especialidadId).stream()
                .map(m -> new MedicoDTO(m.getId(), m.getNombreCompleto()))
                .collect(Collectors.toList());
    }
}
