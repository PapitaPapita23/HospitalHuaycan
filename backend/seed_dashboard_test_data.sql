-- Datos de prueba para verificar el dashboard de /home (KPIs + graficos)
-- Pegar y ejecutar en el SQL Editor de Supabase.
-- Reutiliza las especialidades/medicos ya sembrados por DataSeeder.java (por eso
-- se busca por codigo/cip en vez de asumir IDs fijos). Seguro de re-ejecutar:
-- los INSERT con clave unica usan ON CONFLICT DO NOTHING.

BEGIN;

-- 1) Pacientes de prueba (uno inactivo, para que "pacientes activos" != total)
INSERT INTO hospital_hc.paciente (dni, nombre, apellidos, fecha_nacimiento, genero, distrito, activo)
VALUES
  ('71111111', 'Juana',  'Quispe Mamani',  '1990-03-14', 'F', 'Ate',     true),
  ('71111112', 'Carlos', 'Huaman Rojas',   '1985-07-22', 'M', 'Huaycan', true),
  ('71111113', 'Maria',  'Condori Flores', '2001-11-05', 'F', 'Ate',     true),
  ('71111114', 'Luis',   'Torres Gomez',   '1978-01-30', 'M', 'Vitarte', true),
  ('71111115', 'Rosa',   'Mendoza Vega',   '1995-09-18', 'F', 'Huaycan', true),
  ('71111116', 'Jorge',  'Alarcon Diaz',   '1965-05-09', 'M', 'Ate',     true),
  ('71111117', 'Ana',    'Paredes Rios',   '1988-12-02', 'F', 'Vitarte', true),
  ('71111118', 'Pedro',  'Cardenas Luna',  '1972-04-25', 'M', 'Ate',     false)
ON CONFLICT (dni) DO NOTHING;

-- 2) Historia clinica por cada paciente de prueba
INSERT INTO hospital_hc.historia_clinica (paciente_id, numero_historia)
SELECT p.id, 'HC-TEST-' || p.dni
FROM hospital_hc.paciente p
WHERE p.dni LIKE '7111111%'
ON CONFLICT (paciente_id) DO NOTHING;

-- 3) Citas de HOY: cubren los 4 estados, ambos turnos y 6 especialidades
INSERT INTO hospital_hc.cita_medica
  (paciente_id, medico_id, especialidad_id, fecha_cita, hora_cita, turno, estado, numero_ticket, tipo_cita)
VALUES
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111111'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-45892'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='MED-01'), CURRENT_DATE, '08:00', 'MANANA', 'PENDIENTE', 'TEST-H01', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111112'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-78412'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='MED-01'), CURRENT_DATE, '08:30', 'MANANA', 'ATENDIDO',  'TEST-H02', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111113'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-45892'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='MED-01'), CURRENT_DATE, '14:00', 'TARDE',   'ATENDIDO',  'TEST-H03', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111114'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-96532'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='PED-02'), CURRENT_DATE, '09:00', 'MANANA', 'ATENDIDO',  'TEST-H04', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111115'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-12457'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='PED-02'), CURRENT_DATE, '09:30', 'MANANA', 'PENDIENTE', 'TEST-H05', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111116'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-96532'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='PED-02'), CURRENT_DATE, '14:30', 'TARDE',   'PENDIENTE', 'TEST-H06', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111117'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-85412'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='GIN-04'), CURRENT_DATE, '10:00', 'MANANA', 'ATENDIDO',  'TEST-H07', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111118'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-85412'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='GIN-04'), CURRENT_DATE, '15:00', 'TARDE',   'CANCELADO', 'TEST-H08', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111111'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-63254'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='CAR-03'), CURRENT_DATE, '08:00', 'MANANA', 'ATENDIDO',  'TEST-H09', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111112'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-63254'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='CAR-03'), CURRENT_DATE, '15:30', 'TARDE',   'NO_ASISTIO','TEST-H10', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111113'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-25896'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='ODO-07'), CURRENT_DATE, '11:00', 'MANANA', 'PENDIENTE', 'TEST-H11', 'NORMAL'),
  ((SELECT id FROM hospital_hc.paciente WHERE dni='71111114'), (SELECT id FROM hospital_hc.medico WHERE cip='CMP-36985'), (SELECT id FROM hospital_hc.especialidad WHERE codigo='OFT-05'), CURRENT_DATE, '16:00', 'TARDE',   'CANCELADO', 'TEST-H12', 'NORMAL')
ON CONFLICT (numero_ticket) DO NOTHING;

-- 4) Tendencia: citas de los ultimos 6 dias (hoy-6 .. hoy-1), con un dia en 0
--    para probar el relleno de ceros del chart de tendencia.
INSERT INTO hospital_hc.cita_medica
  (paciente_id, medico_id, especialidad_id, fecha_cita, hora_cita, turno, estado, numero_ticket, tipo_cita)
SELECT
  (SELECT id FROM hospital_hc.paciente WHERE dni='71111111'),
  (SELECT id FROM hospital_hc.medico WHERE cip='CMP-45892'),
  (SELECT id FROM hospital_hc.especialidad WHERE codigo='MED-01'),
  d.fecha,
  '09:00',
  'MANANA',
  'ATENDIDO',
  'TT-' || to_char(d.fecha, 'MMDD') || '-' || gs.n,
  'NORMAL'
FROM (VALUES
  (CURRENT_DATE - 6, 3),
  (CURRENT_DATE - 5, 5),
  (CURRENT_DATE - 4, 0),  -- dia sin citas a proposito
  (CURRENT_DATE - 3, 4),
  (CURRENT_DATE - 2, 6),
  (CURRENT_DATE - 1, 2)
) AS d(fecha, cantidad)
CROSS JOIN LATERAL generate_series(1, d.cantidad) AS gs(n)
WHERE d.cantidad > 0
ON CONFLICT (numero_ticket) DO NOTHING;

-- 5) Atenciones para algunas de las citas de HOY (no todas: una cita PENDIENTE
--    normalmente aun no tiene fila de atencion hasta que arranca el triaje).
INSERT INTO hospital_hc.atencion_medica (cita_id, historia_clinica_id, medico_id, estado_consulta)
SELECT c.id, hc.id, c.medico_id, v.estado_consulta
FROM (VALUES
  ('TEST-H01', 'PENDIENTE'),
  ('TEST-H09', 'EN_TRIAJE'),
  ('TEST-H04', 'EN_CONSULTA'),
  ('TEST-H02', 'FINALIZADO'),
  ('TEST-H03', 'FINALIZADO'),
  ('TEST-H07', 'FINALIZADO')
) AS v(numero_ticket, estado_consulta)
JOIN hospital_hc.cita_medica c ON c.numero_ticket = v.numero_ticket
JOIN hospital_hc.historia_clinica hc ON hc.paciente_id = c.paciente_id
ON CONFLICT (cita_id) DO NOTHING;

-- 6) Documentos escaneados de prueba (para el KPI de "Documentos escaneados")
INSERT INTO hospital_hc.documento_escaneado (historia_clinica_id, nombre_archivo, url_archivo, tipo_documento)
SELECT hc.id, 'test-doc-' || p.dni || '.jpg', 'https://example.invalid/seed/' || p.dni || '.jpg', 'HISTORIA_FISICA'
FROM hospital_hc.paciente p
JOIN hospital_hc.historia_clinica hc ON hc.paciente_id = p.id
WHERE p.dni IN ('71111111', '71111112', '71111113', '71111114', '71111115');

COMMIT;

-- Verificacion rapida: compara esto contra lo que muestre GET /api/dashboard/resumen
SELECT 'citas hoy' AS metrica, COUNT(*)::text AS valor FROM hospital_hc.cita_medica WHERE fecha_cita = CURRENT_DATE
UNION ALL
SELECT 'citas ultimos 7 dias', COUNT(*)::text FROM hospital_hc.cita_medica WHERE fecha_cita BETWEEN CURRENT_DATE - 6 AND CURRENT_DATE
UNION ALL
SELECT 'atenciones hoy', COUNT(*)::text FROM hospital_hc.atencion_medica WHERE fecha_atencion = CURRENT_DATE
UNION ALL
SELECT 'pacientes activos', COUNT(*)::text FROM hospital_hc.paciente WHERE activo = true
UNION ALL
SELECT 'documentos escaneados', COUNT(*)::text FROM hospital_hc.documento_escaneado;
