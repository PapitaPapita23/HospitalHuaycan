package com.hospital.hc.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.hc.dto.AtencionPasadaDto;
import com.hospital.hc.dto.CitaMedicoHU04Dto;
import com.hospital.hc.dto.ConsultaRequestDTO;
import com.hospital.hc.dto.DocumentoEscaneadoDto;
import com.hospital.hc.dto.MedicamentoRecetaDTO;
import com.hospital.hc.dto.TriajeRequestDTO;
import com.hospital.hc.models.AtencionMedica;
import com.hospital.hc.models.Cie10;
import com.hospital.hc.models.CitaMedica;
import com.hospital.hc.models.HistoriaClinica;
import com.hospital.hc.models.RecetaMedica;
import com.hospital.hc.models.Usuario;
import com.hospital.hc.repositories.AtencionMedicaRepository;
import com.hospital.hc.repositories.Cie10Repository;
import com.hospital.hc.repositories.CitaMedicaRepository;
import com.hospital.hc.repositories.DocumentoEscaneadoRepository;
import com.hospital.hc.repositories.HistoriaClinicaRepository;
import com.hospital.hc.repositories.RecetaMedicaRepository;
import com.hospital.hc.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AtencionMedicaService {

    private final AtencionMedicaRepository atencionMedicaRepository;
    private final Cie10Repository cie10Repository;
    private final RecetaMedicaRepository recetaMedicaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CitaMedicaRepository citaMedicaRepository;
    private final HistoriaClinicaRepository historiaClinicaRepository;
    private final DocumentoEscaneadoRepository documentoEscaneadoRepository;
    private final ObjectMapper objectMapper;

    // Inyección de dependencias por constructor
    public AtencionMedicaService(
            AtencionMedicaRepository atencionMedicaRepository,
            Cie10Repository cie10Repository,
            RecetaMedicaRepository recetaMedicaRepository,
            UsuarioRepository usuarioRepository,
            CitaMedicaRepository citaMedicaRepository,
            HistoriaClinicaRepository historiaClinicaRepository,
            DocumentoEscaneadoRepository documentoEscaneadoRepository,
            ObjectMapper objectMapper) {
        this.atencionMedicaRepository = atencionMedicaRepository;
        this.cie10Repository = cie10Repository;
        this.recetaMedicaRepository = recetaMedicaRepository;
        this.usuarioRepository = usuarioRepository;
        this.citaMedicaRepository = citaMedicaRepository;
        this.historiaClinicaRepository = historiaClinicaRepository;
        this.documentoEscaneadoRepository = documentoEscaneadoRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * HU05: Registrar Triaje
     */
    @Transactional
    public AtencionMedica registrarTriaje(Long id, TriajeRequestDTO dto, String username) {
        // 1. Intentar buscar por ID de atención médica
        AtencionMedica atencion = atencionMedicaRepository.findById(id).orElse(null);
        
        CitaMedica cita = null;
        if (atencion == null) {
            // 2. Si no se encuentra, asumir que 'id' es el ID de la cita (cita_id)
            cita = citaMedicaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("No se encontró cita médica ni atención médica con ID: " + id));
            
            // Buscar si ya existe una atención para esta cita
            atencion = atencionMedicaRepository.findByCitaId(cita.getId()).orElse(null);
        } else {
            cita = atencion.getCita();
        }

        // 3. Si no existe, crear la atención médica dinámicamente
        if (atencion == null) {
            if (cita == null) {
                throw new RuntimeException("No se puede registrar el triaje porque la cita asociada es nula.");
            }
            
            HistoriaClinica historia = historiaClinicaRepository.findByPacienteId(cita.getPaciente().getId())
                    .orElseThrow(() -> new RuntimeException("El paciente no tiene una Historia Clínica registrada."));

            atencion = AtencionMedica.builder()
                    .cita(cita)
                    .historiaClinica(historia)
                    .fechaAtencion(LocalDate.now())
                    .medico(cita.getMedico())
                    .estadoConsulta("PENDIENTE")
                    .build();
        }

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No se encontró el usuario: " + username));

        // Guardar signos vitales
        atencion.setFr(dto.fr());
        atencion.setFc(dto.fc());
        atencion.setTemperatura(dto.temperatura());
        atencion.setPaSistolica(dto.paSistolica());
        atencion.setPaDiastolica(dto.paDiastolica());
        atencion.setSpo2(dto.spo2());
        atencion.setPeso(dto.peso());
        atencion.setTalla(dto.talla());
        atencion.setImc(dto.imc());

        // Auditoría e información de triaje
        atencion.setTriajeRealizadoPor(usuario);
        atencion.setTriajeFechaHora(LocalDateTime.now());
        atencion.setEstadoConsulta("EN_CONSULTA");
        atencion.setUpdatedAt(LocalDateTime.now());

        // Actualizar el estado de la cita asociada
        if (cita != null) {
            cita.setUpdatedAt(LocalDateTime.now());
            citaMedicaRepository.save(cita);
        }

        return atencionMedicaRepository.save(atencion);
    }


    /**
     * HU06 y HU07: Registrar Consulta y Generar Receta Médica
     */
    @Transactional
    public AtencionMedica registrarConsulta(Long id, ConsultaRequestDTO dto) {
        // 1. Intentar buscar por ID de atención médica
        AtencionMedica atencion = atencionMedicaRepository.findById(id).orElse(null);
        
        CitaMedica cita = null;
        if (atencion == null) {
            // 2. Asumir que 'id' es el ID de la cita (cita_id)
            cita = citaMedicaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("No se encontró cita médica ni atención médica con ID: " + id));
            
            // Buscar si ya existe una atención para esta cita (del triaje previo)
            atencion = atencionMedicaRepository.findByCitaId(cita.getId())
                    .orElseThrow(() -> new RuntimeException("No se ha registrado el triaje para esta cita médica."));
        } else {
            cita = atencion.getCita();
        }

        // Validar código CIE-10 Principal
        Cie10 cie10 = cie10Repository.findById(dto.diagnosticoCie10Principal())
                .orElseThrow(() -> new RuntimeException("El código CIE-10 principal '" + dto.diagnosticoCie10Principal() + "' no es válido o no existe."));

        if (!Boolean.TRUE.equals(cie10.getActivo())) {
            throw new RuntimeException("El código CIE-10 principal '" + dto.diagnosticoCie10Principal() + "' no está activo.");
        }

        // Guardar datos médicos
        atencion.setAnamnesis(dto.anamnesis());
        atencion.setExamenFisico(dto.examenFisico());
        atencion.setDiagnosticoCie10Principal(dto.diagnosticoCie10Principal());
        atencion.setDiagnosticoDescripcion(cie10.getDescripcion());

        // Serializar diagnósticos secundarios (List a JSON String para jsonb)
        if (dto.diagnosticosSecundarios() != null) {
            try {
                String jsonStr = objectMapper.writeValueAsString(dto.diagnosticosSecundarios());
                atencion.setDiagnosticosSecundarios(jsonStr);
            } catch (Exception e) {
                throw new RuntimeException("Error al serializar los diagnósticos secundarios a JSON", e);
            }
        } else {
            atencion.setDiagnosticosSecundarios(null);
        }

        atencion.setTratamiento(dto.tratamiento());
        atencion.setIndicaciones(dto.indicaciones());
        atencion.setEstadoConsulta("FINALIZADO");
        atencion.setUpdatedAt(LocalDateTime.now());

        // Actualizar el estado de la cita asociada
        if (cita != null) {
            cita.setEstado("ATENDIDO");
            cita.setUpdatedAt(LocalDateTime.now());
            citaMedicaRepository.save(cita);
        }

        AtencionMedica guardada = atencionMedicaRepository.save(atencion);

        // Generar registros en la tabla receta_medica si aplica
        if (dto.medicamentos() != null && !dto.medicamentos().isEmpty()) {
            for (MedicamentoRecetaDTO medDto : dto.medicamentos()) {
                RecetaMedica receta = RecetaMedica.builder()
                        .atencion(guardada)
                        .medicamento(medDto.medicamento())
                        .concentracion(medDto.concentracion())
                        .formaFarmaceutica(medDto.formaFarmaceutica())
                        .dosis(medDto.dosis())
                        .frecuencia(medDto.frecuencia())
                        .duracionDias(medDto.duracionDias())
                        .indicacionesEspeciales(medDto.indicacionesEspeciales())
                        .createdAt(LocalDateTime.now())
                        .build();
                recetaMedicaRepository.save(receta);
            }
        }

        return guardada;
    }

    /**
     * Obtener el historial clínico de un paciente ordenado por fecha de atención descendente
     */
    public List<AtencionPasadaDto> obtenerHistorial(Long historiaClinicaId) {
        List<AtencionMedica> atenciones = atencionMedicaRepository.findByHistoriaClinicaIdOrderByFechaAtencionDesc(historiaClinicaId);
        return atenciones.stream()
                .map(this::mapToAtencionPasadaDto)
                .toList();
    }

    /**
     * Buscar diagnósticos CIE-10 activos por código o descripción
     */
    public List<Cie10> buscarCie10(String query) {
        return cie10Repository.findByCodigoContainingIgnoreCaseOrDescripcionContainingIgnoreCase(query, query);
    }

    /**
     * Obtiene todas las citas de hoy (Dashboard de triaje global para enfermería)
     */
    public List<CitaMedicoHU04Dto> obtenerAgendaHoyTodo() {
        List<CitaMedica> citasHoy = citaMedicaRepository.findByFechaCitaOrderByHoraCitaAsc(LocalDate.now());

        return citasHoy.stream().map(cita -> {
            List<AtencionPasadaDto> historialConsultas = new ArrayList<>();
            List<DocumentoEscaneadoDto> documentosEscaneados = new ArrayList<>();

            Optional<HistoriaClinica> historiaOpt = historiaClinicaRepository.findByPacienteId(cita.getPaciente().getId());
            if (historiaOpt.isPresent()) {
                Long historiaId = historiaOpt.get().getId();
                List<AtencionMedica> atencionesPasadas = atencionMedicaRepository.findByHistoriaClinicaIdOrderByFechaAtencionDesc(historiaId);
                historialConsultas = atencionesPasadas.stream().map(this::mapToAtencionPasadaDto).collect(Collectors.toList());

                documentosEscaneados = documentoEscaneadoRepository.findByHistoriaClinicaIdOrderByFechaSubidaDesc(historiaId)
                        .stream().map(doc -> DocumentoEscaneadoDto.builder()
                                .id(doc.getId())
                                .historiaClinicaId(historiaId)
                                .nombreArchivo(doc.getNombreArchivo())
                                .urlArchivo(doc.getUrlArchivo())
                                .fechaSubida(doc.getFechaSubida())
                                .build()
                        ).collect(Collectors.toList());
            }

            // Normalización de estados para la consistencia visual del frontend
            String estadoConsulta = cita.getEstado();
            if ("PENDIENTE".equals(estadoConsulta)) {
                AtencionMedica atencion = atencionMedicaRepository.findByCitaId(cita.getId()).orElse(null);
                if (atencion != null && "EN_CONSULTA".equals(atencion.getEstadoConsulta())) {
                    estadoConsulta = "EN_CONSULTA";
                }
            } else if ("EN_ATENCION".equals(estadoConsulta)) {

                estadoConsulta = "EN_ATENCION";
            } else if ("ATENDIDO".equals(estadoConsulta)) {
                estadoConsulta = "ATENDIDO";
            }

            return CitaMedicoHU04Dto.builder()
                    .citaId(cita.getId())
                    .horaInicio(cita.getHoraCita())
                    .estadoConsulta(estadoConsulta)
                    .pacienteDni(cita.getPaciente().getDni())
                    .pacienteNombres(cita.getPaciente().getNombre() + " " + cita.getPaciente().getApellidos())
                    .historialConsultas(historialConsultas)
                    .documentosEscaneados(documentosEscaneados)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Mapeador a DTO de salida
     */
    private AtencionPasadaDto mapToAtencionPasadaDto(AtencionMedica atencion) {
        java.util.List<com.hospital.hc.dto.MedicamentoRecetaDTO> recetasDto = new java.util.ArrayList<>();
        if (atencion.getRecetas() != null) {
            recetasDto = atencion.getRecetas().stream().map(r -> new com.hospital.hc.dto.MedicamentoRecetaDTO(
                r.getMedicamento(),
                r.getConcentracion(),
                r.getFormaFarmaceutica(),
                r.getDosis(),
                r.getFrecuencia(),
                r.getDuracionDias(),
                r.getIndicacionesEspeciales()
            )).toList();
        }

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
                .recetas(recetasDto)
                .build();
    }
}
