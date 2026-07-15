package com.hospital.hc.controllers;

import com.hospital.hc.dto.DashboardResumenDTO;
import com.hospital.hc.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    public ResponseEntity<DashboardResumenDTO> obtenerResumen(
            @RequestParam(value = "fecha", required = false) String fechaStr) {
        LocalDate fecha = fechaStr != null ? LocalDate.parse(fechaStr) : LocalDate.now();
        return ResponseEntity.ok(dashboardService.obtenerResumen(fecha));
    }
}
