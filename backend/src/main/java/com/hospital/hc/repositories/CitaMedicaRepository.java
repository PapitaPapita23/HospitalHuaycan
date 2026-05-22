package com.hospital.hc.repositories;

import com.hospital.hc.models.CitaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitaMedicaRepository extends JpaRepository<CitaMedica, Long> {
    List<CitaMedica> findByPacienteId(Long pacienteId);
    List<CitaMedica> findByMedicoIdAndFechaCita(Integer medicoId, LocalDate fechaCita);
    boolean existsByNumeroTicket(String numeroTicket);
    List<CitaMedica> findByMedicoIdAndFechaCitaOrderByHoraCitaAsc(Integer medicoId, LocalDate fechaCita);
}
