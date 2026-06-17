package com.hospital.hc.repositories;

import com.hospital.hc.models.DocumentoEscaneado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoEscaneadoRepository extends JpaRepository<DocumentoEscaneado, Long> {
    List<DocumentoEscaneado> findByHistoriaClinicaIdOrderByFechaSubidaDesc(Long historiaClinicaId);
}
