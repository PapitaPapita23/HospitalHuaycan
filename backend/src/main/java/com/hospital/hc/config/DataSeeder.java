package com.hospital.hc.config;

import com.hospital.hc.models.Rol;
import com.hospital.hc.models.Usuario;
import com.hospital.hc.repositories.RolRepository;
import com.hospital.hc.repositories.UsuarioRepository;
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
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
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
}
