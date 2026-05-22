package com.hospital.hc.services;

import com.hospital.hc.dto.PacienteBusquedaHU03Dto;
import com.hospital.hc.models.HistoriaClinica;
import com.hospital.hc.models.Paciente;
import com.hospital.hc.repositories.HistoriaClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ArchivoService {

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    public Optional<PacienteBusquedaHU03Dto> buscarPaciente(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Optional.empty();
        }

        query = query.trim();
        Optional<HistoriaClinica> historiaOpt;

        if (query.matches("\\d{8}")) {
            historiaOpt = historiaClinicaRepository.findByPacienteDni(query);
        } else {
            historiaOpt = historiaClinicaRepository.findByNumeroHistoria(query);
        }

        return historiaOpt.map(this::mapToDto);
    }

    private PacienteBusquedaHU03Dto mapToDto(HistoriaClinica historia) {
        Paciente paciente = historia.getPaciente();
        Integer edad = Period.between(paciente.getFechaNacimiento(), LocalDate.now()).getYears();

        return PacienteBusquedaHU03Dto.builder()
                .pacienteId(paciente.getId())
                .dni(paciente.getDni())
                .nombres(paciente.getNombre())
                .apellidos(paciente.getApellidos())
                .genero(paciente.getGenero())
                .edad(edad)
                .grupoSanguineo(paciente.getGrupoSanguineo())
                .alergias(paciente.getAlergias())
                .estadoSis(paciente.getEstadoSis())
                .historiaClinicaId(historia.getId())
                .fechaCreacionExpediente(historia.getFechaCreacion())
                .build();
    }
}
