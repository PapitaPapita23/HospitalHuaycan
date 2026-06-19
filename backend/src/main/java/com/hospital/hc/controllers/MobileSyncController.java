package com.hospital.hc.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/mobile-sync")
public class MobileSyncController {

    // Guarda temporalmente las imágenes de una sesión. El key es el sessionId.
    private final Map<String, List<String>> sessionImages = new ConcurrentHashMap<>();

    @PostMapping("/{sessionId}")
    public ResponseEntity<?> addImageToSession(@PathVariable String sessionId, @RequestBody Map<String, String> payload) {
        try {
            String base64Image = payload.get("image");
            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body("Imagen no proporcionada");
            }

            sessionImages.putIfAbsent(sessionId, new ArrayList<>());
            sessionImages.get(sessionId).add(base64Image);

            return ResponseEntity.ok(Map.of("message", "Imagen recibida con éxito"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getSessionImages(@PathVariable String sessionId) {
        List<String> images = sessionImages.getOrDefault(sessionId, new ArrayList<>());
        return ResponseEntity.ok(Map.of("images", images));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> clearSession(@PathVariable String sessionId) {
        sessionImages.remove(sessionId);
        return ResponseEntity.ok(Map.of("message", "Sesión limpiada"));
    }
}
