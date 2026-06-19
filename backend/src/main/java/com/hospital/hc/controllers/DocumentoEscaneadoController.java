package com.hospital.hc.controllers;

import com.hospital.hc.dto.DocumentoEscaneadoDto;
import com.hospital.hc.dto.DocumentoEscaneadoRequestDto;
import com.hospital.hc.services.DocumentoEscaneadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documentos-escaneados")
public class DocumentoEscaneadoController {

    @Autowired
    private DocumentoEscaneadoService documentoEscaneadoService;

    @PostMapping
    public ResponseEntity<DocumentoEscaneadoDto> guardarDocumento(@RequestBody DocumentoEscaneadoRequestDto requestDto) {
        DocumentoEscaneadoDto guardado = documentoEscaneadoService.guardarDocumento(requestDto);
        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/{historiaClinicaId}")
    public ResponseEntity<List<DocumentoEscaneadoDto>> listarDocumentos(@PathVariable Long historiaClinicaId) {
        List<DocumentoEscaneadoDto> lista = documentoEscaneadoService.listarPorHistoriaClinica(historiaClinicaId);
        return ResponseEntity.ok(lista);
    }
}
