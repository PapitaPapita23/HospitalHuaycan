package com.hospital.hc.repositories;

import com.hospital.hc.models.Cie10;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface Cie10Repository extends JpaRepository<Cie10, String> {

    @Query("SELECT c FROM Cie10 c WHERE c.activo = true AND (" +
           "LOWER(c.codigo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.descripcion) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Cie10> buscarActivosPorCodigoODescripcion(@Param("query") String query);

    @Query("SELECT c FROM Cie10 c WHERE c.activo = true AND (" +
           "LOWER(c.codigo) LIKE LOWER(CONCAT('%', :codigo, '%')) OR " +
           "LOWER(c.descripcion) LIKE LOWER(CONCAT('%', :descripcion, '%')))")
    List<Cie10> findByCodigoContainingIgnoreCaseOrDescripcionContainingIgnoreCase(
        @Param("codigo") String codigo,
        @Param("descripcion") String descripcion
    );
}
