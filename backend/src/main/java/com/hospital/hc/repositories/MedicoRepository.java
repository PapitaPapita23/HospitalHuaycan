package com.hospital.hc.repositories;

import com.hospital.hc.models.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Integer> {
    List<Medico> findByEspecialidadIdAndActivoTrue(Integer especialidadId);
    Optional<Medico> findByDni(String dni);
    Optional<Medico> findByCip(String cip);
    Optional<Medico> findByUsuarioUsername(String username);
}
