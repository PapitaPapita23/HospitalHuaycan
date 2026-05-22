package com.hospital.hc.controllers;

import com.hospital.hc.dto.CitaMedicoHU04Dto;
import com.hospital.hc.services.ConsultaMedicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaMedicaController {

    @Autowired
    private ConsultaMedicaService consultaMedicaService;

    @GetMapping("/agenda-hoy")
    public ResponseEntity<List<CitaMedicoHU04Dto>> obtenerAgendaHoy(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String username = principal.getName();
        try {
            List<CitaMedicoHU04Dto> agenda = consultaMedicaService.obtenerAgendaDia(username);
            return ResponseEntity.ok(agenda);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
