package com.hospital.hc.controllers;

import com.hospital.hc.services.OcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    private final OcrService ocrService;

    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> ocr(@RequestBody Map<String, String> body) {
        String base64 = body.get("image");
        if (base64 == null || base64.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "image requerido"));
        }

        // Quitar prefijo data:image/...;base64, si viene del frontend
        if (base64.contains(",")) {
            base64 = base64.substring(base64.indexOf(",") + 1);
        }

        String texto = ocrService.recognizeHandwriting(base64);
        return ResponseEntity.ok(Map.of("text", texto));
    }
}
