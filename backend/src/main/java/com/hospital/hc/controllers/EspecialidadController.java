package com.hospital.hc.controllers;

import com.hospital.hc.models.Especialidad;
import com.hospital.hc.repositories.EspecialidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/especialidades")
public class EspecialidadController {

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @GetMapping
    public List<Especialidad> listarActivas() {
        return especialidadRepository.findByActivoTrue();
    }
}
