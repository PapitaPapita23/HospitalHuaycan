package com.hospital.hc.controllers;

import com.hospital.hc.dto.PacienteBusquedaHU03Dto;
import com.hospital.hc.services.ArchivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/archivo")
public class ArchivoController {

    @Autowired
    private ArchivoService archivoService;

    @GetMapping("/pacientes/buscar")
    public ResponseEntity<PacienteBusquedaHU03Dto> buscarPaciente(@RequestParam("q") String query) {
        Optional<PacienteBusquedaHU03Dto> resultado = archivoService.buscarPaciente(query);
        
        if (resultado.isPresent()) {
            return ResponseEntity.ok(resultado.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
