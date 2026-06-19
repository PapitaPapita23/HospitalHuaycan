package com.hospital.hc.services;

import com.hospital.hc.dto.DocumentoEscaneadoDto;
import com.hospital.hc.dto.DocumentoEscaneadoRequestDto;
import com.hospital.hc.models.DocumentoEscaneado;
import com.hospital.hc.models.HistoriaClinica;
import com.hospital.hc.repositories.DocumentoEscaneadoRepository;
import com.hospital.hc.repositories.HistoriaClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentoEscaneadoService {

    @Autowired
    private DocumentoEscaneadoRepository documentoEscaneadoRepository;

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    public DocumentoEscaneadoDto guardarDocumento(DocumentoEscaneadoRequestDto requestDto) {
        HistoriaClinica historia = historiaClinicaRepository.findById(requestDto.getHistoriaClinicaId())
                .orElseThrow(() -> new RuntimeException("Historia clínica no encontrada."));

        DocumentoEscaneado doc = DocumentoEscaneado.builder()
                .historiaClinica(historia)
                .nombreArchivo(requestDto.getNombreArchivo())
                .urlArchivo(requestDto.getUrlArchivo())
                .fechaSubida(java.time.LocalDateTime.now())
                .fechaDocumento(requestDto.getFechaDocumento())
                .tipoDocumento(requestDto.getTipoDocumento())
                .textoOcr(requestDto.getTextoOcr())
                .build();

        DocumentoEscaneado saved = documentoEscaneadoRepository.save(doc);

        return mapToDto(saved);
    }

    public List<DocumentoEscaneadoDto> listarPorHistoriaClinica(Long historiaClinicaId) {
        return documentoEscaneadoRepository.findByHistoriaClinicaIdOrderByFechaSubidaDesc(historiaClinicaId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private DocumentoEscaneadoDto mapToDto(DocumentoEscaneado doc) {
        return DocumentoEscaneadoDto.builder()
                .id(doc.getId())
                .historiaClinicaId(doc.getHistoriaClinica().getId())
                .nombreArchivo(doc.getNombreArchivo())
                .urlArchivo(doc.getUrlArchivo())
                .fechaSubida(doc.getFechaSubida())
                .fechaDocumento(doc.getFechaDocumento())
                .tipoDocumento(doc.getTipoDocumento())
                .textoOcr(doc.getTextoOcr())
                .build();
    }
}
