package com.hospital.hc.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OcrService {

    private final RestTemplate restTemplate;

    @Value("${groq.api-key}")
    private String apiKey;

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private static final String PROMPT =
            "Eres un sistema OCR para documentos medicos de un hospital peruano. " +
            "Extrae TODO el texto visible en la imagen, incluyendo texto manuscrito, " +
            "medicamentos, dosis, diagnosticos y abreviaciones medicas en espanol. " +
            "Responde UNICAMENTE con el texto extraido, sin explicaciones.";

    public OcrService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public String recognizeHandwriting(String base64Image) {
        Map<String, Object> textContent = Map.of("type", "text", "text", PROMPT);
        Map<String, Object> imageUrl = Map.of("url", "data:image/jpeg;base64," + base64Image);
        Map<String, Object> imageContent = Map.of("type", "image_url", "image_url", imageUrl);
        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", List.of(textContent, imageContent)
        );
        Map<String, Object> body = Map.of(
                "model", "llama-3.2-11b-vision-preview",
                "messages", List.of(userMessage),
                "max_tokens", 1024
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    GROQ_URL, new HttpEntity<>(body, headers), Map.class);

            var choices = (List<?>) response.getBody().get("choices");
            var first = (Map<?, ?>) choices.get(0);
            var message = (Map<?, ?>) first.get("message");
            return message.get("content").toString().trim();
        } catch (Exception e) {
            return "";
        }
    }
}