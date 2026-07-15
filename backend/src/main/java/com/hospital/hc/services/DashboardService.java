package com.hospital.hc.services;

import com.hospital.hc.dto.ConteoItemDto;
import com.hospital.hc.dto.ConteoPorFechaDto;
import com.hospital.hc.dto.DashboardResumenDTO;
import com.hospital.hc.models.DocumentoEscaneado;
import com.hospital.hc.repositories.AtencionMedicaRepository;
import com.hospital.hc.repositories.CitaMedicaRepository;
import com.hospital.hc.repositories.DocumentoEscaneadoRepository;
import com.hospital.hc.repositories.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final List<String> ESTADOS_CITA = List.of("PENDIENTE", "ATENDIDO", "CANCELADO", "NO_ASISTIO");
    private static final List<String> TURNOS = List.of("MANANA", "TARDE");
    private static final List<String> ESTADOS_CONSULTA = List.of("PENDIENTE", "EN_TRIAJE", "EN_CONSULTA", "FINALIZADO");
    private static final int TOP_ESPECIALIDADES = 5;

    private final CitaMedicaRepository citaMedicaRepository;
    private final AtencionMedicaRepository atencionMedicaRepository;
    private final PacienteRepository pacienteRepository;
    private final DocumentoEscaneadoRepository documentoEscaneadoRepository;

    public DashboardService(
            CitaMedicaRepository citaMedicaRepository,
            AtencionMedicaRepository atencionMedicaRepository,
            PacienteRepository pacienteRepository,
            DocumentoEscaneadoRepository documentoEscaneadoRepository) {
        this.citaMedicaRepository = citaMedicaRepository;
        this.atencionMedicaRepository = atencionMedicaRepository;
        this.pacienteRepository = pacienteRepository;
        this.documentoEscaneadoRepository = documentoEscaneadoRepository;
    }

    public DashboardResumenDTO obtenerResumen(LocalDate fecha) {
        LocalDate desde7Dias = fecha.minusDays(6);

        List<ConteoItemDto> citasPorEstadoHoy = rellenarConCeros(
                citaMedicaRepository.countByEstadoAndFecha(fecha), ESTADOS_CITA);
        List<ConteoItemDto> citasPorTurnoHoy = rellenarConCeros(
                citaMedicaRepository.countByTurnoAndFecha(fecha), TURNOS);
        List<ConteoItemDto> topEspecialidadesHoy = citaMedicaRepository.countByEspecialidadAndFecha(fecha)
                .stream()
                .limit(TOP_ESPECIALIDADES)
                .toList();
        List<ConteoPorFechaDto> citasUltimos7Dias = rellenarFechas(
                citaMedicaRepository.countByFechaCitaBetween(desde7Dias, fecha), desde7Dias, fecha);
        List<ConteoItemDto> atencionesPorEstadoConsultaHoy = rellenarConCeros(
                atencionMedicaRepository.countByEstadoConsultaAndFecha(fecha), ESTADOS_CONSULTA);
        List<DocumentoEscaneado> documentosRecientes = documentoEscaneadoRepository.findByFechaSubidaBetween(
                desde7Dias.atStartOfDay(), fecha.plusDays(1).atStartOfDay());
        List<ConteoPorFechaDto> documentosUltimos7Dias = rellenarFechas(
                agruparDocumentosPorDia(documentosRecientes), desde7Dias, fecha);

        return DashboardResumenDTO.builder()
                .fecha(fecha)
                .totalCitasHoy(citaMedicaRepository.countByFechaCita(fecha))
                .citasPorTurnoHoy(citasPorTurnoHoy)
                .citasPorEstadoHoy(citasPorEstadoHoy)
                .topEspecialidadesHoy(topEspecialidadesHoy)
                .citasUltimos7Dias(citasUltimos7Dias)
                .atencionesPorEstadoConsultaHoy(atencionesPorEstadoConsultaHoy)
                .totalPacientesActivos(pacienteRepository.countByActivoTrue())
                .totalDocumentosEscaneados(documentoEscaneadoRepository.count())
                .totalDocumentosEscaneadosHoy(documentoEscaneadoRepository.countByFechaSubidaBetween(
                        fecha.atStartOfDay(), fecha.plusDays(1).atStartOfDay()))
                .documentosUltimos7Dias(documentosUltimos7Dias)
                .build();
    }

    private List<ConteoItemDto> rellenarConCeros(List<ConteoItemDto> datos, List<String> ordenFijo) {
        Map<String, Long> porEtiqueta = datos.stream()
                .collect(Collectors.toMap(ConteoItemDto::getEtiqueta, ConteoItemDto::getTotal));
        return ordenFijo.stream()
                .map(etiqueta -> new ConteoItemDto(etiqueta, porEtiqueta.getOrDefault(etiqueta, 0L)))
                .toList();
    }

    private List<ConteoPorFechaDto> agruparDocumentosPorDia(List<DocumentoEscaneado> documentos) {
        Map<LocalDate, Long> porFecha = documentos.stream()
                .collect(Collectors.groupingBy(d -> d.getFechaSubida().toLocalDate(), Collectors.counting()));
        return porFecha.entrySet().stream()
                .map(e -> new ConteoPorFechaDto(e.getKey(), e.getValue()))
                .toList();
    }

    private List<ConteoPorFechaDto> rellenarFechas(List<ConteoPorFechaDto> datos, LocalDate desde, LocalDate hasta) {
        Map<LocalDate, Long> porFecha = datos.stream()
                .collect(Collectors.toMap(ConteoPorFechaDto::getFecha, ConteoPorFechaDto::getTotal));
        List<ConteoPorFechaDto> resultado = new ArrayList<>();
        for (LocalDate fecha = desde; !fecha.isAfter(hasta); fecha = fecha.plusDays(1)) {
            resultado.add(new ConteoPorFechaDto(fecha, porFecha.getOrDefault(fecha, 0L)));
        }
        return resultado;
    }
}
