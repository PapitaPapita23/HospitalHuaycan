package com.hospital.hc.repositories;

import com.hospital.hc.models.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {
    Optional<HistoriaClinica> findByNumeroHistoria(String numeroHistoria);
    Optional<HistoriaClinica> findByPacienteId(Long pacienteId);
}
