-- Datos de prueba EN VOLUMEN para el dashboard de /home.
-- Ejecutar en el SQL Editor de Supabase DESPUES de seed_dashboard_test_data.sql
-- (usa un rango de DNI '72xxxxxx' distinto al '711111xx' del script anterior,
-- asi que no chocan entre si). Seguro de re-ejecutar (ON CONFLICT DO NOTHING).
--
-- Genera: 80 pacientes sinteticos, 80 citas de HOY repartidas entre los 4
-- estados / ambos turnos / 9 combos medico-especialidad, ~141 citas mas en
-- los ultimos 6 dias (volumen creciente, un dia en 0), atenciones para todas
-- las citas ATENDIDO + una parte de las PENDIENTE, y 50 documentos escaneados.

BEGIN;

-- 1) 80 pacientes sinteticos (1 de cada 7 queda inactivo)
INSERT INTO hospital_hc.paciente (dni, nombre, apellidos, fecha_nacimiento, genero, distrito, activo)
SELECT
  '72' || lpad(n::text, 6, '0'),
  (ARRAY['Maria','Jose','Rosa','Luis','Carmen','Juan','Ana','Pedro','Lucia','Carlos',
         'Elena','Miguel','Sofia','Jorge','Patricia','Diego','Andrea','Victor','Claudia','Ricardo'])[((n-1) % 20) + 1],
  (ARRAY['Garcia','Rodriguez','Gonzalez','Flores','Mamani','Quispe','Huaman','Condori','Torres','Vega',
         'Rojas','Diaz','Paredes','Cardenas','Rios','Salazar','Chavez','Vargas','Castillo','Nunez'])[((n-1) % 20) + 1]
    || ' ' ||
  (ARRAY['Perez','Lopez','Ramos','Sanchez','Cruz','Reyes','Morales','Ortiz','Silva','Medina'])[((n-1) % 10) + 1],
  DATE '1960-02-01' + ((n * 137) % 15000),
  CASE WHEN n % 2 = 0 THEN 'M' ELSE 'F' END,
  (ARRAY['Ate','Huaycan','Vitarte','Chosica'])[((n-1) % 4) + 1],
  (n % 7 <> 0)
FROM generate_series(1, 80) AS n
ON CONFLICT (dni) DO NOTHING;

-- 2) Historia clinica para cada uno
INSERT INTO hospital_hc.historia_clinica (paciente_id, numero_historia)
SELECT p.id, 'HC-' || p.dni
FROM hospital_hc.paciente p
WHERE p.dni LIKE '72%'
ON CONFLICT (paciente_id) DO NOTHING;

-- 3) 80 citas de HOY: una por paciente nuevo, cicladas entre 9 combos
--    medico-especialidad, turno alternado y estado con proporciones realistas
--    (45% ATENDIDO, 30% PENDIENTE, 15% CANCELADO, 10% NO_ASISTIO)
WITH nums AS (
  SELECT
    n,
    (ARRAY['MED-01','MED-01','PED-02','PED-02','CAR-03','GIN-04','OFT-05','TRA-06','ODO-07'])[((n-1) % 9) + 1] AS especialidad_codigo,
    (ARRAY['CMP-45892','CMP-78412','CMP-96532','CMP-12457','CMP-63254','CMP-85412','CMP-36985','CMP-14785','CMP-25896'])[((n-1) % 9) + 1] AS medico_cip,
    (ARRAY['ATENDIDO','ATENDIDO','ATENDIDO','ATENDIDO','ATENDIDO','ATENDIDO','ATENDIDO','ATENDIDO','ATENDIDO',
           'PENDIENTE','PENDIENTE','PENDIENTE','PENDIENTE','PENDIENTE','PENDIENTE',
           'CANCELADO','CANCELADO','CANCELADO',
           'NO_ASISTIO','NO_ASISTIO'])[((n-1) % 20) + 1] AS estado,
    CASE WHEN n % 2 = 0 THEN 'MANANA' ELSE 'TARDE' END AS turno
  FROM generate_series(1, 80) AS n
)
INSERT INTO hospital_hc.cita_medica
  (paciente_id, medico_id, especialidad_id, fecha_cita, hora_cita, turno, estado, numero_ticket, tipo_cita)
SELECT
  p.id,
  m.id,
  e.id,
  CURRENT_DATE,
  (CASE WHEN nums.turno = 'MANANA' THEN TIME '08:00' ELSE TIME '14:00' END) + ((nums.n % 12) * INTERVAL '5 minutes'),
  nums.turno,
  nums.estado,
  'BLK-H-' || nums.n,
  'NORMAL'
FROM nums
JOIN hospital_hc.paciente p ON p.dni = '72' || lpad(nums.n::text, 6, '0')
JOIN hospital_hc.medico m ON m.cip = nums.medico_cip
JOIN hospital_hc.especialidad e ON e.codigo = nums.especialidad_codigo
ON CONFLICT (numero_ticket) DO NOTHING;

-- 4) Tendencia en volumen: citas de los ultimos 6 dias (hoy-6 .. hoy-1),
--    con un dia en 0 para seguir probando el relleno de ceros.
INSERT INTO hospital_hc.cita_medica
  (paciente_id, medico_id, especialidad_id, fecha_cita, hora_cita, turno, estado, numero_ticket, tipo_cita)
SELECT
  (SELECT id FROM hospital_hc.paciente WHERE dni = '72' || lpad((((gs.n - 1) % 80) + 1)::text, 6, '0')),
  (SELECT id FROM hospital_hc.medico WHERE cip = 'CMP-45892'),
  (SELECT id FROM hospital_hc.especialidad WHERE codigo = 'MED-01'),
  d.fecha,
  '09:00',
  'MANANA',
  'ATENDIDO',
  'BLK-T-' || to_char(d.fecha, 'MMDD') || '-' || gs.n,
  'NORMAL'
FROM (VALUES
  (CURRENT_DATE - 6, 20),
  (CURRENT_DATE - 5, 35),
  (CURRENT_DATE - 4, 0),   -- dia sin citas a proposito
  (CURRENT_DATE - 3, 28),
  (CURRENT_DATE - 2, 40),
  (CURRENT_DATE - 1, 18)
) AS d(fecha, cantidad)
CROSS JOIN LATERAL generate_series(1, d.cantidad) AS gs(n)
WHERE d.cantidad > 0
ON CONFLICT (numero_ticket) DO NOTHING;

-- 5) Atenciones: todas las citas ATENDIDO de hoy -> FINALIZADO
INSERT INTO hospital_hc.atencion_medica (cita_id, historia_clinica_id, medico_id, estado_consulta)
SELECT c.id, hc.id, c.medico_id, 'FINALIZADO'
FROM hospital_hc.cita_medica c
JOIN hospital_hc.historia_clinica hc ON hc.paciente_id = c.paciente_id
WHERE c.fecha_cita = CURRENT_DATE AND c.estado = 'ATENDIDO' AND c.numero_ticket LIKE 'BLK-H-%'
ON CONFLICT (cita_id) DO NOTHING;

--    y las citas PENDIENTE de hoy -> en curso, cicladas entre las 3 etapas tempranas
INSERT INTO hospital_hc.atencion_medica (cita_id, historia_clinica_id, medico_id, estado_consulta)
SELECT c.id, hc.id, c.medico_id,
  (ARRAY['PENDIENTE', 'EN_TRIAJE', 'EN_CONSULTA'])[((row_number() OVER (ORDER BY c.id) - 1) % 3) + 1]
FROM hospital_hc.cita_medica c
JOIN hospital_hc.historia_clinica hc ON hc.paciente_id = c.paciente_id
WHERE c.fecha_cita = CURRENT_DATE AND c.estado = 'PENDIENTE' AND c.numero_ticket LIKE 'BLK-H-%'
ON CONFLICT (cita_id) DO NOTHING;

-- 6) 50 documentos escaneados repartidos entre todas las historias existentes
WITH historias_numeradas AS (
  SELECT id, row_number() OVER (ORDER BY id) AS rn, count(*) OVER () AS total
  FROM hospital_hc.historia_clinica
)
INSERT INTO hospital_hc.documento_escaneado (historia_clinica_id, nombre_archivo, url_archivo, tipo_documento, fecha_subida)
SELECT
  hn.id,
  'bulk-doc-' || gs.n || '.jpg',
  'https://example.invalid/seed/bulk-' || gs.n || '.jpg',
  (ARRAY['HISTORIA_FISICA', 'DNI', 'SIS', 'RECETA'])[((gs.n - 1) % 4) + 1],
  now() - ((gs.n % 30) || ' days')::interval
FROM generate_series(1, 50) AS gs(n)
JOIN historias_numeradas hn ON hn.rn = ((gs.n - 1) % hn.total) + 1;

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
