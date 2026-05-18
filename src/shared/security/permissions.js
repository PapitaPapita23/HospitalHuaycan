export const permissions = {
  VER_PANEL: 'ver_panel',
  VER_PACIENTES: 'ver_pacientes',
  VER_HISTORIAS: 'ver_historias',
  VER_AUDITORIA: 'ver_auditoria',
}

export const rolePermissions = {
  admin: [
    permissions.VER_PANEL,
    permissions.VER_PACIENTES,
    permissions.VER_HISTORIAS,
    permissions.VER_AUDITORIA,
  ],
  medico: [permissions.VER_PANEL, permissions.VER_PACIENTES, permissions.VER_HISTORIAS],
  enfermeria: [permissions.VER_PANEL, permissions.VER_PACIENTES, permissions.VER_HISTORIAS],
  admision: [permissions.VER_PANEL, permissions.VER_PACIENTES],
}
