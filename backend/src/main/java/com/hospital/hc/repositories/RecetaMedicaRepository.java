package com.hospital.hc.repositories;

import com.hospital.hc.models.RecetaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecetaMedicaRepository extends JpaRepository<RecetaMedica, Long> {
}
