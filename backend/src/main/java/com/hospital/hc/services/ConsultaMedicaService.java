package com.hospital.hc.services;

import com.hospital.hc.dto.AtencionPasadaDto;
import com.hospital.hc.dto.CitaMedicoHU04Dto;
import com.hospital.hc.models.AtencionMedica;
import com.hospital.hc.models.CitaMedica;
import com.hospital.hc.models.HistoriaClinica;
import com.hospital.hc.models.Medico;
import com.hospital.hc.repositories.AtencionMedicaRepository;
import com.hospital.hc.repositories.CitaMedicaRepository;
import com.hospital.hc.repositories.HistoriaClinicaRepository;
import com.hospital.hc.repositories.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ConsultaMedicaService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private CitaMedicaRepository citaMedicaRepository;

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Autowired
    private AtencionMedicaRepository atencionMedicaRepository;

    @Autowired
    private com.hospital.hc.repositories.DocumentoEscaneadoRepository documentoEscaneadoRepository;

    public List<CitaMedicoHU04Dto> obtenerAgendaDia(String username) {
        Medico medico = medicoRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new RuntimeException("No se encontró el perfil de médico asociado al usuario."));

        List<CitaMedica> citasHoy = citaMedicaRepository.findByMedicoIdAndFechaCitaOrderByHoraCitaAsc(medico.getId(), LocalDate.now());

        return citasHoy.stream().map(cita -> {
            List<AtencionPasadaDto> historialConsultas = new ArrayList<>();
            List<com.hospital.hc.dto.DocumentoEscaneadoDto> documentosEscaneados = new ArrayList<>();

            Optional<HistoriaClinica> historiaOpt = historiaClinicaRepository.findByPacienteId(cita.getPaciente().getId());
            if (historiaOpt.isPresent()) {
                Long historiaId = historiaOpt.get().getId();
                List<AtencionMedica> atencionesPasadas = atencionMedicaRepository.findByHistoriaClinicaIdOrderByFechaAtencionDesc(historiaId);
                historialConsultas = atencionesPasadas.stream().map(this::mapToAtencionPasadaDto).collect(Collectors.toList());

                documentosEscaneados = documentoEscaneadoRepository.findByHistoriaClinicaIdOrderByFechaSubidaDesc(historiaId)
                        .stream().map(doc -> com.hospital.hc.dto.DocumentoEscaneadoDto.builder()
                                .id(doc.getId())
                                .historiaClinicaId(historiaId)
                                .nombreArchivo(doc.getNombreArchivo())
                                .urlArchivo(doc.getUrlArchivo())
                                .fechaSubida(doc.getFechaSubida())
                                .build()
                        ).collect(Collectors.toList());
            }

            return CitaMedicoHU04Dto.builder()
                    .citaId(cita.getId())
                    .horaInicio(cita.getHoraCita())
                    .estadoConsulta(cita.getEstado())
                    .pacienteDni(cita.getPaciente().getDni())
                    .pacienteNombres(cita.getPaciente().getNombre() + " " + cita.getPaciente().getApellidos())
                    .historialConsultas(historialConsultas)
                    .documentosEscaneados(documentosEscaneados)
                    .build();
        }).collect(Collectors.toList());
    }

    private AtencionPasadaDto mapToAtencionPasadaDto(AtencionMedica atencion) {
        return AtencionPasadaDto.builder()
                .fechaAtencion(atencion.getFechaAtencion())
                .fr(atencion.getFr())
                .fc(atencion.getFc())
                .temperatura(atencion.getTemperatura())
                .paSistolica(atencion.getPaSistolica())
                .paDiastolica(atencion.getPaDiastolica())
                .spo2(atencion.getSpo2())
                .peso(atencion.getPeso())
                .talla(atencion.getTalla())
                .imc(atencion.getImc())
                .escalaDolor(atencion.getEscalaDolor())
                .anamnesis(atencion.getAnamnesis())
                .examenFisico(atencion.getExamenFisico())
                .diagnosticoCie10Principal(atencion.getDiagnosticoCie10Principal())
                .diagnosticoDescripcion(atencion.getDiagnosticoDescripcion())
                .diagnosticosSecundarios(atencion.getDiagnosticosSecundarios())
                .tratamiento(atencion.getTratamiento())
                .indicaciones(atencion.getIndicaciones())
                .solicitudExamenes(atencion.getSolicitudExamenes())
                .build();
    }
}
