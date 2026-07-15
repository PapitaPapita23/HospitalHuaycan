package com.hospital.hc.repositories;

import com.hospital.hc.dto.ConteoItemDto;
import com.hospital.hc.dto.ConteoPorFechaDto;
import com.hospital.hc.models.CitaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitaMedicaRepository extends JpaRepository<CitaMedica, Long> {
    List<CitaMedica> findByPacienteId(Long pacienteId);
    List<CitaMedica> findByMedicoIdAndFechaCita(Integer medicoId, LocalDate fechaCita);
    boolean existsByNumeroTicket(String numeroTicket);
    List<CitaMedica> findByMedicoIdAndFechaCitaOrderByHoraCitaAsc(Integer medicoId, LocalDate fechaCita);
    List<CitaMedica> findByFechaCitaOrderByHoraCitaAsc(java.time.LocalDate fechaCita);

    long countByFechaCita(LocalDate fechaCita);

    @Query("SELECT new com.hospital.hc.dto.ConteoItemDto(c.estado, COUNT(c)) FROM CitaMedica c WHERE c.fechaCita = :fecha GROUP BY c.estado")
    List<ConteoItemDto> countByEstadoAndFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT new com.hospital.hc.dto.ConteoItemDto(c.turno, COUNT(c)) FROM CitaMedica c WHERE c.fechaCita = :fecha GROUP BY c.turno")
    List<ConteoItemDto> countByTurnoAndFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT new com.hospital.hc.dto.ConteoItemDto(e.nombre, COUNT(c)) FROM CitaMedica c JOIN c.especialidad e WHERE c.fechaCita = :fecha GROUP BY e.nombre ORDER BY COUNT(c) DESC")
    List<ConteoItemDto> countByEspecialidadAndFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT new com.hospital.hc.dto.ConteoPorFechaDto(c.fechaCita, COUNT(c)) FROM CitaMedica c WHERE c.fechaCita BETWEEN :desde AND :hasta GROUP BY c.fechaCita ORDER BY c.fechaCita ASC")
    List<ConteoPorFechaDto> countByFechaCitaBetween(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);
}
