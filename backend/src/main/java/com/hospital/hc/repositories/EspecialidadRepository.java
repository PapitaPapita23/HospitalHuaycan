package com.hospital.hc.repositories;

import com.hospital.hc.models.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad, Integer> {
    List<Especialidad> findByActivoTrue();
    Optional<Especialidad> findByNombre(String nombre);
}
