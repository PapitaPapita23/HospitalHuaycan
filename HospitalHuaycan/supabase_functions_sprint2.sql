-- Ejecutar en: Supabase > SQL Editor

-- =====================================================
-- HU03: Buscar paciente por DNI o número de historia
-- =====================================================
CREATE OR REPLACE FUNCTION public.buscar_paciente_hc(p_query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
BEGIN
  IF p_query ~ '^\d{8}$' THEN
    -- Búsqueda por DNI
    SELECT row_to_json(r) INTO v_result FROM (
      SELECT
        p.id                AS "pacienteId",
        p.dni,
        p.nombre            AS "nombres",
        p.apellidos,
        p.genero,
        DATE_PART('year', AGE(CURRENT_DATE, p.fecha_nacimiento))::int AS "edad",
        p.grupo_sanguineo   AS "grupoSanguineo",
        p.alergias,
        p.estado_sis        AS "estadoSis",
        hc.id               AS "historiaClinicaId",
        hc.fecha_creacion   AS "fechaCreacionExpediente"
      FROM hospital_hc.historia_clinica hc
      JOIN hospital_hc.paciente p ON p.id = hc.paciente_id
      WHERE p.dni = p_query
        AND hc.activo = true
      LIMIT 1
    ) r;
  ELSE
    -- Búsqueda por número de historia (ej: HC-0001)
    SELECT row_to_json(r) INTO v_result FROM (
      SELECT
        p.id                AS "pacienteId",
        p.dni,
        p.nombre            AS "nombres",
        p.apellidos,
        p.genero,
        DATE_PART('year', AGE(CURRENT_DATE, p.fecha_nacimiento))::int AS "edad",
        p.grupo_sanguineo   AS "grupoSanguineo",
        p.alergias,
        p.estado_sis        AS "estadoSis",
        hc.id               AS "historiaClinicaId",
        hc.fecha_creacion   AS "fechaCreacionExpediente"
      FROM hospital_hc.historia_clinica hc
      JOIN hospital_hc.paciente p ON p.id = hc.paciente_id
      WHERE hc.numero_historia ILIKE '%' || p_query || '%'
        AND hc.activo = true
      LIMIT 1
    ) r;
  END IF;

  RETURN v_result;
END;
$$;

-- =====================================================
-- HU04: Agenda del día para el médico autenticado
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_agenda_medico_hoy(p_usuario_id bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_medico_id int;
  v_result    json;
BEGIN
  SELECT id INTO v_medico_id
  FROM hospital_hc.medico
  WHERE usuario_id = p_usuario_id AND activo = true;

  IF v_medico_id IS NULL THEN
    RETURN '[]'::json;
  END IF;

  SELECT json_agg(cita_data ORDER BY (cita_data->>'horaInicio')) INTO v_result
  FROM (
    SELECT json_build_object(
      'citaId',          cm.id,
      'horaInicio',      cm.hora_cita,
      'estadoConsulta',  cm.estado,
      'pacienteDni',     p.dni,
      'pacienteNombres', p.nombre || ' ' || p.apellidos,
      'historialConsultas', COALESCE((
        SELECT json_agg(
          json_build_object(
            'fechaAtencion',             am.fecha_atencion,
            'fr',                        am.fr,
            'fc',                        am.fc,
            'temperatura',               am.temperatura,
            'paSistolica',               am.pa_sistolica,
            'paDiastolica',              am.pa_diastolica,
            'spo2',                      am.spo2,
            'peso',                      am.peso,
            'talla',                     am.talla,
            'imc',                       am.imc,
            'escalaDolor',               am.escala_dolor,
            'anamnesis',                 am.anamnesis,
            'examenFisico',              am.examen_fisico,
            'diagnosticoCie10Principal', am.diagnostico_cie10_principal,
            'diagnosticoDescripcion',    am.diagnostico_descripcion,
            'diagnosticosSecundarios',   am.diagnosticos_secundarios,
            'tratamiento',               am.tratamiento,
            'indicaciones',              am.indicaciones,
            'solicitudExamenes',         am.solicitud_examenes
          ) ORDER BY am.fecha_atencion DESC
        )
        FROM hospital_hc.atencion_medica am
        JOIN hospital_hc.historia_clinica hc2 ON hc2.id = am.historia_clinica_id
        WHERE hc2.paciente_id = p.id AND hc2.activo = true
      ), '[]'::json)
    ) AS cita_data
    FROM hospital_hc.cita_medica cm
    JOIN hospital_hc.paciente p ON p.id = cm.paciente_id
    WHERE cm.medico_id = v_medico_id
      AND cm.fecha_cita = CURRENT_DATE
  ) sub;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
