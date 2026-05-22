package com.hospital.hc.repositories;

import com.hospital.hc.models.AtencionMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtencionMedicaRepository extends JpaRepository<AtencionMedica, Long> {
    List<AtencionMedica> findByHistoriaClinicaIdOrderByFechaAtencionDesc(Long historiaClinicaId);
}
