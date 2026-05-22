package com.hospital.hc.config;

import com.hospital.hc.models.Rol;
import com.hospital.hc.models.Usuario;
import com.hospital.hc.models.Especialidad;
import com.hospital.hc.models.Medico;
import com.hospital.hc.repositories.RolRepository;
import com.hospital.hc.repositories.UsuarioRepository;
import com.hospital.hc.repositories.EspecialidadRepository;
import com.hospital.hc.repositories.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Sembrar Roles si no existen
        createRolIfNotExists("ROLE_ADMINISTRADOR", "Rol de Administrador del Sistema");
        createRolIfNotExists("ROLE_ADMISION", "Rol para personal de admisión hospitalaria");
        createRolIfNotExists("ROLE_ARCHIVO", "Rol para personal de archivo médico");
        createRolIfNotExists("ROLE_ENFERMERIA", "Rol para personal de enfermería y triaje");
        createRolIfNotExists("ROLE_MEDICO", "Rol para médicos del hospital");

        // Sembrar Usuarios de prueba si no existen
        createUsuarioIfNotExists("admin", "123456", "Administrador Principal", "ROLE_ADMINISTRADOR");
        createUsuarioIfNotExists("admision1", "123456", "Personal de Admisión 1", "ROLE_ADMISION");
        createUsuarioIfNotExists("archivo1", "123456", "Personal de Archivo 1", "ROLE_ARCHIVO");
        createUsuarioIfNotExists("enfermera1", "123456", "Enfermera Principal 1", "ROLE_ENFERMERIA");
        createUsuarioIfNotExists("medico1", "123456", "Médico de Guardia 1", "ROLE_MEDICO");

        // Sembrar Especialidades
        createEspecialidadIfNotExists("Medicina General", "MED-01");
        createEspecialidadIfNotExists("Pediatría", "PED-02");
        createEspecialidadIfNotExists("Cardiología", "CAR-03");
        createEspecialidadIfNotExists("Ginecología", "GIN-04");
        createEspecialidadIfNotExists("Oftalmología", "OFT-05");
        createEspecialidadIfNotExists("Traumatología", "TRA-06");
        createEspecialidadIfNotExists("Odontología", "ODO-07");

        // Sembrar Médicos
        createMedicoIfNotExists("Dr. Alejandro Ríos", "CMP-45892", "20000001", "medico_rios", "Medicina General");
        createMedicoIfNotExists("Dra. Elena Torres", "CMP-78412", "20000002", "medico_torres", "Medicina General");
        createMedicoIfNotExists("Dra. Sofía Valdivia", "CMP-96532", "20000003", "medico_valdivia", "Pediatría");
        createMedicoIfNotExists("Dr. Manuel Rojas", "CMP-12457", "20000004", "medico_rojas", "Pediatría");
        createMedicoIfNotExists("Dr. Hugo Delgado", "CMP-63254", "20000005", "medico_delgado", "Cardiología");
        createMedicoIfNotExists("Dra. Patricia Mendoza", "CMP-85412", "20000006", "medico_mendoza", "Ginecología");
        createMedicoIfNotExists("Dr. Fernando Soto", "CMP-36985", "20000007", "medico_soto", "Oftalmología");
        createMedicoIfNotExists("Dra. Carmen Luna", "CMP-14785", "20000008", "medico_luna", "Traumatología");
        createMedicoIfNotExists("Dr. Gabriel Ortiz", "CMP-25896", "20000009", "medico_ortiz", "Odontología");
        } catch (Exception e) {
            System.out.println(">>> [DataSeeder] BD local no disponible, omitiendo seed: " + e.getMessage());
        }
    }

    private void createRolIfNotExists(String nombreRol, String descripcion) {
        Optional<Rol> rolOpt = rolRepository.findByNombreRol(nombreRol);
        if (rolOpt.isEmpty()) {
            Rol rol = new Rol();
            rol.setNombreRol(nombreRol);
            rol.setDescripcion(descripcion);
            rol.setActivo(true);
            rol.setCreatedAt(LocalDateTime.now());
            rolRepository.save(rol);
            System.out.println(">>> [DataSeeder] Rol '" + nombreRol + "' creado con éxito.");
        }
    }

    private void createUsuarioIfNotExists(String username, String password, String nombreCompleto, String nombreRol) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        if (usuarioOpt.isEmpty()) {
            Rol rol = rolRepository.findByNombreRol(nombreRol)
                    .orElseThrow(() -> new RuntimeException("Error: Rol " + nombreRol + " no encontrado en la base de datos para sembrar el usuario " + username));

            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setPassword(passwordEncoder.encode(password));
            usuario.setNombreCompleto(nombreCompleto);
            usuario.setEstado("ACTIVO");
            usuario.setRol(rol);
            usuario.setIntentosFallidos((short) 0);
            usuario.setCreatedAt(LocalDateTime.now());
            usuario.setUpdatedAt(LocalDateTime.now());
            usuarioRepository.save(usuario);
            System.out.println(">>> [DataSeeder] Usuario '" + username + "' creado con éxito con rol " + nombreRol + ".");
        }
    }

    private void createEspecialidadIfNotExists(String nombre, String codigo) {
        Optional<Especialidad> espOpt = especialidadRepository.findByNombre(nombre);
        if (espOpt.isEmpty()) {
            Especialidad esp = new Especialidad();
            esp.setNombre(nombre);
            esp.setCodigo(codigo);
            esp.setDescripcion("Especialidad de " + nombre);
            esp.setActivo(true);
            especialidadRepository.save(esp);
            System.out.println(">>> [DataSeeder] Especialidad '" + nombre + "' creada con éxito.");
        }
    }

    private void createMedicoIfNotExists(String nombreCompleto, String cip, String dni, String username, String nombreEspecialidad) {
        Optional<Medico> medicoOpt = medicoRepository.findByCip(cip);
        if (medicoOpt.isEmpty()) {
            // Buscar o crear usuario
            Usuario usuario = usuarioRepository.findByUsername(username).orElseGet(() -> {
                Rol rol = rolRepository.findByNombreRol("ROLE_MEDICO")
                        .orElseThrow(() -> new RuntimeException("Error: Rol ROLE_MEDICO no encontrado"));
                Usuario u = new Usuario();
                u.setUsername(username);
                u.setPassword(passwordEncoder.encode("123456"));
                u.setNombreCompleto(nombreCompleto);
                u.setEstado("ACTIVO");
                u.setRol(rol);
                u.setIntentosFallidos((short) 0);
                u.setCreatedAt(LocalDateTime.now());
                u.setUpdatedAt(LocalDateTime.now());
                return usuarioRepository.save(u);
            });

            // Buscar especialidad
            Especialidad especialidad = especialidadRepository.findByNombre(nombreEspecialidad)
                    .orElseThrow(() -> new RuntimeException("Error: Especialidad " + nombreEspecialidad + " no encontrada"));

            Medico medico = new Medico();
            medico.setNombreCompleto(nombreCompleto);
            medico.setCip(cip);
            medico.setDni(dni);
            medico.setEspecialidad(especialidad);
            medico.setUsuario(usuario);
            medico.setActivo(true);
            medico.setCreatedAt(LocalDateTime.now());
            medicoRepository.save(medico);
            System.out.println(">>> [DataSeeder] Médico '" + nombreCompleto + "' registrado con éxito.");
        }
    }
}
