package com.hospital.hc.repositories;

import com.hospital.hc.dto.ConteoItemDto;
import com.hospital.hc.models.AtencionMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AtencionMedicaRepository extends JpaRepository<AtencionMedica, Long> {
    List<AtencionMedica> findByHistoriaClinicaIdOrderByFechaAtencionDesc(Long historiaClinicaId);
    java.util.Optional<AtencionMedica> findByCitaId(Long citaId);

    @Query("SELECT new com.hospital.hc.dto.ConteoItemDto(a.estadoConsulta, COUNT(a)) FROM AtencionMedica a WHERE a.fechaAtencion = :fecha GROUP BY a.estadoConsulta")
    List<ConteoItemDto> countByEstadoConsultaAndFecha(@Param("fecha") LocalDate fecha);
}
