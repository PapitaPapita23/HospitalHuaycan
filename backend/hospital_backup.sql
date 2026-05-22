--
-- PostgreSQL database dump
--

-- \restrict ObnBg43qCD7SdRtOnQwkxR55o5TuWvcagg3RoShMlq3JFW1WY2haRVoEheXTN0r

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hospital_hc; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS hospital_hc;


ALTER SCHEMA hospital_hc OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: atencion_medica; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.atencion_medica (
    id bigint NOT NULL,
    cita_id bigint NOT NULL,
    historia_clinica_id bigint NOT NULL,
    fecha_atencion date DEFAULT CURRENT_DATE NOT NULL,
    hora_inicio time without time zone,
    hora_fin time without time zone,
    fr smallint,
    fc smallint,
    temperatura numeric(4,1),
    pa_sistolica smallint,
    pa_diastolica smallint,
    spo2 numeric(5,2),
    peso numeric(5,2),
    talla numeric(5,2),
    imc numeric(5,2),
    escala_dolor smallint,
    triaje_realizado_por bigint,
    triaje_fecha_hora timestamp with time zone,
    anamnesis text,
    examen_fisico text,
    diagnostico_cie10_principal character varying(10),
    diagnostico_descripcion text,
    diagnosticos_secundarios jsonb,
    tratamiento text,
    indicaciones text,
    solicitud_examenes text,
    derivacion character varying(200),
    proxima_cita date,
    estado_consulta character varying(15) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    medico_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT atencion_medica_escala_dolor_check CHECK (((escala_dolor >= 0) AND (escala_dolor <= 10))),
    CONSTRAINT atencion_medica_estado_consulta_check CHECK (((estado_consulta)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('EN_TRIAJE'::character varying)::text, ('EN_CONSULTA'::character varying)::text, ('FINALIZADO'::character varying)::text])))
);


ALTER TABLE hospital_hc.atencion_medica OWNER TO postgres;

--
-- Name: atencion_medica_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.atencion_medica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.atencion_medica_id_seq OWNER TO postgres;

--
-- Name: atencion_medica_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.atencion_medica_id_seq OWNED BY hospital_hc.atencion_medica.id;


--
-- Name: auditoria_log; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.auditoria_log (
    id bigint NOT NULL,
    usuario_id bigint,
    accion character varying(50) NOT NULL,
    tabla_afectada character varying(100),
    registro_id bigint,
    datos_anteriores jsonb,
    datos_nuevos jsonb,
    ip_origen inet,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hospital_hc.auditoria_log OWNER TO postgres;

--
-- Name: auditoria_log_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.auditoria_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.auditoria_log_id_seq OWNER TO postgres;

--
-- Name: auditoria_log_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.auditoria_log_id_seq OWNED BY hospital_hc.auditoria_log.id;


--
-- Name: cie10; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.cie10 (
    codigo character varying(10) NOT NULL,
    descripcion character varying(300) NOT NULL,
    categoria character varying(10),
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE hospital_hc.cie10 OWNER TO postgres;

--
-- Name: cita_medica; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.cita_medica (
    id bigint NOT NULL,
    paciente_id bigint NOT NULL,
    medico_id integer NOT NULL,
    especialidad_id integer NOT NULL,
    fecha_cita date NOT NULL,
    hora_cita time without time zone NOT NULL,
    turno character varying(10) NOT NULL,
    estado character varying(15) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    motivo_consulta character varying(300),
    numero_ticket character varying(20),
    tipo_cita character varying(20) DEFAULT 'NORMAL'::character varying NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cita_medica_estado_check CHECK (((estado)::text = ANY (ARRAY[('PENDIENTE'::character varying)::text, ('ATENDIDO'::character varying)::text, ('CANCELADO'::character varying)::text, ('NO_ASISTIO'::character varying)::text]))),
    CONSTRAINT cita_medica_tipo_cita_check CHECK (((tipo_cita)::text = ANY (ARRAY[('NORMAL'::character varying)::text, ('URGENCIA'::character varying)::text, ('SEGUIMIENTO'::character varying)::text]))),
    CONSTRAINT cita_medica_turno_check CHECK (((turno)::text = ANY (ARRAY[('MANANA'::character varying)::text, ('TARDE'::character varying)::text])))
);


ALTER TABLE hospital_hc.cita_medica OWNER TO postgres;

--
-- Name: cita_medica_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.cita_medica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.cita_medica_id_seq OWNER TO postgres;

--
-- Name: cita_medica_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.cita_medica_id_seq OWNED BY hospital_hc.cita_medica.id;


--
-- Name: especialidad; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.especialidad (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    codigo character varying(10)
);


ALTER TABLE hospital_hc.especialidad OWNER TO postgres;

--
-- Name: especialidad_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.especialidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.especialidad_id_seq OWNER TO postgres;

--
-- Name: especialidad_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.especialidad_id_seq OWNED BY hospital_hc.especialidad.id;


--
-- Name: historia_clinica; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.historia_clinica (
    id bigint NOT NULL,
    paciente_id bigint NOT NULL,
    numero_historia character varying(20) NOT NULL,
    fecha_creacion date DEFAULT CURRENT_DATE NOT NULL,
    observaciones_iniciales text,
    activo boolean DEFAULT true NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hospital_hc.historia_clinica OWNER TO postgres;

--
-- Name: historia_clinica_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.historia_clinica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.historia_clinica_id_seq OWNER TO postgres;

--
-- Name: historia_clinica_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.historia_clinica_id_seq OWNED BY hospital_hc.historia_clinica.id;


--
-- Name: medico; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.medico (
    id integer NOT NULL,
    nombre_completo character varying(200) NOT NULL,
    cip character varying(15) NOT NULL,
    dni character(8) NOT NULL,
    telefono character varying(15),
    email_institucional character varying(150),
    especialidad_id integer NOT NULL,
    usuario_id bigint NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hospital_hc.medico OWNER TO postgres;

--
-- Name: medico_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.medico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.medico_id_seq OWNER TO postgres;

--
-- Name: medico_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.medico_id_seq OWNED BY hospital_hc.medico.id;


--
-- Name: paciente; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.paciente (
    id bigint NOT NULL,
    dni character(8) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellidos character varying(150) NOT NULL,
    fecha_nacimiento date NOT NULL,
    genero character(1) NOT NULL,
    telefono character varying(15),
    telefono_emergencia character varying(15),
    direccion character varying(300),
    distrito character varying(100),
    email character varying(150),
    grupo_sanguineo character varying(5),
    alergias text,
    estado_sis boolean DEFAULT false NOT NULL,
    num_sis character varying(20),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT paciente_genero_check CHECK ((genero = ANY (ARRAY['M'::bpchar, 'F'::bpchar, 'O'::bpchar])))
);


ALTER TABLE hospital_hc.paciente OWNER TO postgres;

--
-- Name: paciente_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.paciente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.paciente_id_seq OWNER TO postgres;

--
-- Name: paciente_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.paciente_id_seq OWNED BY hospital_hc.paciente.id;


--
-- Name: receta_medica; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.receta_medica (
    id bigint NOT NULL,
    atencion_id bigint NOT NULL,
    medicamento character varying(200) NOT NULL,
    concentracion character varying(50),
    forma_farmaceutica character varying(50),
    dosis character varying(100) NOT NULL,
    frecuencia character varying(100) NOT NULL,
    duracion_dias smallint,
    indicaciones_especiales text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hospital_hc.receta_medica OWNER TO postgres;

--
-- Name: receta_medica_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.receta_medica_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.receta_medica_id_seq OWNER TO postgres;

--
-- Name: receta_medica_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.receta_medica_id_seq OWNED BY hospital_hc.receta_medica.id;


--
-- Name: rol; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.rol (
    id integer NOT NULL,
    nombre_rol character varying(50) NOT NULL,
    descripcion character varying(200),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hospital_hc.rol OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.rol_id_seq OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.rol_id_seq OWNED BY hospital_hc.rol.id;


--
-- Name: usuario; Type: TABLE; Schema: hospital_hc; Owner: postgres
--

CREATE TABLE hospital_hc.usuario (
    id bigint NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    estado character varying(10) DEFAULT 'ACTIVO'::character varying NOT NULL,
    rol_id integer NOT NULL,
    intentos_fallidos smallint DEFAULT 0 NOT NULL,
    ultimo_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT usuario_estado_check CHECK (((estado)::text = ANY (ARRAY[('ACTIVO'::character varying)::text, ('INACTIVO'::character varying)::text])))
);


ALTER TABLE hospital_hc.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: hospital_hc; Owner: postgres
--

CREATE SEQUENCE hospital_hc.usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hospital_hc.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: hospital_hc; Owner: postgres
--

ALTER SEQUENCE hospital_hc.usuario_id_seq OWNED BY hospital_hc.usuario.id;


--
-- Name: atencion_medica id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica ALTER COLUMN id SET DEFAULT nextval('hospital_hc.atencion_medica_id_seq'::regclass);


--
-- Name: auditoria_log id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.auditoria_log ALTER COLUMN id SET DEFAULT nextval('hospital_hc.auditoria_log_id_seq'::regclass);


--
-- Name: cita_medica id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica ALTER COLUMN id SET DEFAULT nextval('hospital_hc.cita_medica_id_seq'::regclass);


--
-- Name: especialidad id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.especialidad ALTER COLUMN id SET DEFAULT nextval('hospital_hc.especialidad_id_seq'::regclass);


--
-- Name: historia_clinica id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.historia_clinica ALTER COLUMN id SET DEFAULT nextval('hospital_hc.historia_clinica_id_seq'::regclass);


--
-- Name: medico id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico ALTER COLUMN id SET DEFAULT nextval('hospital_hc.medico_id_seq'::regclass);


--
-- Name: paciente id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.paciente ALTER COLUMN id SET DEFAULT nextval('hospital_hc.paciente_id_seq'::regclass);


--
-- Name: receta_medica id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.receta_medica ALTER COLUMN id SET DEFAULT nextval('hospital_hc.receta_medica_id_seq'::regclass);


--
-- Name: rol id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.rol ALTER COLUMN id SET DEFAULT nextval('hospital_hc.rol_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.usuario ALTER COLUMN id SET DEFAULT nextval('hospital_hc.usuario_id_seq'::regclass);


--
-- Data for Name: atencion_medica; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--



--
-- Data for Name: auditoria_log; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--



--
-- Data for Name: cie10; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.cie10 VALUES ('J06.9', 'Infección aguda de las vías respiratorias superiores, no especificada', 'J00-J99', true);
INSERT INTO hospital_hc.cie10 VALUES ('I10', 'Hipertensión esencial (primaria)', 'I00-I99', true);
INSERT INTO hospital_hc.cie10 VALUES ('E11.9', 'Diabetes mellitus tipo 2 sin complicaciones', 'E00-E90', true);
INSERT INTO hospital_hc.cie10 VALUES ('A09', 'Diarrea y gastroenteritis de presunto origen infeccioso', 'A00-B99', true);


--
-- Data for Name: cita_medica; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.cita_medica VALUES (1, 1, 4, 2, '2026-05-22', '14:00:00', 'TARDE', 'PENDIENTE', NULL, 'TKT-250872', 'NORMAL', 4, '2026-05-21 20:04:41.773581-05', '2026-05-21 20:04:41.773581-05');
INSERT INTO hospital_hc.cita_medica VALUES (2, 2, 1, 1, '2026-05-22', '14:00:00', 'TARDE', 'PENDIENTE', NULL, 'TKT-033648', 'NORMAL', 4, '2026-05-21 20:09:06.653236-05', '2026-05-21 20:09:06.653236-05');
INSERT INTO hospital_hc.cita_medica VALUES (3, 1, 1, 1, '2026-05-22', '08:00:00', 'MANANA', 'PENDIENTE', NULL, 'TKT-629579', 'NORMAL', 4, '2026-05-21 22:45:11.577077-05', '2026-05-21 22:45:11.577077-05');
INSERT INTO hospital_hc.cita_medica VALUES (4, 1, 1, 1, '2026-05-22', '14:00:00', 'TARDE', 'PENDIENTE', NULL, 'TKT-140663', 'NORMAL', 4, '2026-05-21 22:56:58.451262-05', '2026-05-21 22:56:58.451262-05');
INSERT INTO hospital_hc.cita_medica VALUES (5, 1, 1, 1, '2026-05-22', '14:00:00', 'TARDE', 'PENDIENTE', NULL, 'TKT-694461', 'NORMAL', 4, '2026-05-21 23:00:57.298951-05', '2026-05-21 23:00:57.298951-05');


--
-- Data for Name: especialidad; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.especialidad VALUES (1, 'Medicina General', 'Especialidad de Medicina General', true, 'MED-01');
INSERT INTO hospital_hc.especialidad VALUES (2, 'Pediatría', 'Especialidad de Pediatría', true, 'PED-02');
INSERT INTO hospital_hc.especialidad VALUES (3, 'Cardiología', 'Especialidad de Cardiología', true, 'CAR-03');
INSERT INTO hospital_hc.especialidad VALUES (4, 'Ginecología', 'Especialidad de Ginecología', true, 'GIN-04');
INSERT INTO hospital_hc.especialidad VALUES (5, 'Oftalmología', 'Especialidad de Oftalmología', true, 'OFT-05');
INSERT INTO hospital_hc.especialidad VALUES (6, 'Traumatología', 'Especialidad de Traumatología', true, 'TRA-06');
INSERT INTO hospital_hc.especialidad VALUES (7, 'Odontología', 'Especialidad de Odontología', true, 'ODO-07');


--
-- Data for Name: historia_clinica; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--



--
-- Data for Name: medico; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.medico VALUES (1, 'Dr. Alejandro Ríos', 'CMP-45892', '20000001', NULL, NULL, 1, 8, true, '2026-05-21 18:34:33.504202-05');
INSERT INTO hospital_hc.medico VALUES (2, 'Dra. Elena Torres', 'CMP-78412', '20000002', NULL, NULL, 1, 9, true, '2026-05-21 18:34:33.592339-05');
INSERT INTO hospital_hc.medico VALUES (3, 'Dra. Sofía Valdivia', 'CMP-96532', '20000003', NULL, NULL, 2, 10, true, '2026-05-21 18:34:33.67091-05');
INSERT INTO hospital_hc.medico VALUES (4, 'Dr. Manuel Rojas', 'CMP-12457', '20000004', NULL, NULL, 2, 11, true, '2026-05-21 18:34:33.748824-05');
INSERT INTO hospital_hc.medico VALUES (5, 'Dr. Hugo Delgado', 'CMP-63254', '20000005', NULL, NULL, 3, 12, true, '2026-05-21 18:34:33.827499-05');
INSERT INTO hospital_hc.medico VALUES (6, 'Dra. Patricia Mendoza', 'CMP-85412', '20000006', NULL, NULL, 4, 13, true, '2026-05-21 18:34:33.905555-05');
INSERT INTO hospital_hc.medico VALUES (7, 'Dr. Fernando Soto', 'CMP-36985', '20000007', NULL, NULL, 5, 14, true, '2026-05-21 18:34:33.982924-05');
INSERT INTO hospital_hc.medico VALUES (8, 'Dra. Carmen Luna', 'CMP-14785', '20000008', NULL, NULL, 6, 15, true, '2026-05-21 18:34:34.063467-05');
INSERT INTO hospital_hc.medico VALUES (9, 'Dr. Gabriel Ortiz', 'CMP-25896', '20000009', NULL, NULL, 7, 16, true, '2026-05-21 18:34:34.149077-05');


--
-- Data for Name: paciente; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.paciente VALUES (1, '71451841', 'Alexis', 'Bravo Alan', '1900-01-01', 'O', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, true, '2026-05-21 20:01:39.303276-05', '2026-05-21 20:01:39.303276-05');
INSERT INTO hospital_hc.paciente VALUES (2, '77777777', 'JUAN', 'PEREZ', '1900-01-01', 'O', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, true, '2026-05-21 20:07:24.355224-05', '2026-05-21 20:07:24.355224-05');


--
-- Data for Name: receta_medica; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--



--
-- Data for Name: rol; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.rol VALUES (1, 'ROLE_ADMISION', 'Rol para personal de admisión hospitalaria', true, '2026-05-21 00:56:02.68613-05');
INSERT INTO hospital_hc.rol VALUES (2, 'ROLE_MEDICO', 'Rol para médicos del hospital', true, '2026-05-21 00:56:02.728153-05');
INSERT INTO hospital_hc.rol VALUES (3, 'ROLE_ADMINISTRADOR', 'Rol de Administrador del Sistema', true, '2026-05-21 03:53:36.450939-05');
INSERT INTO hospital_hc.rol VALUES (4, 'ROLE_ARCHIVO', 'Rol para personal de archivo médico', true, '2026-05-21 03:53:36.507528-05');
INSERT INTO hospital_hc.rol VALUES (5, 'ROLE_ENFERMERIA', 'Rol para personal de enfermería y triaje', true, '2026-05-21 03:53:36.511525-05');


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: hospital_hc; Owner: postgres
--

INSERT INTO hospital_hc.usuario VALUES (1, 'admision', '$2a$10$1sKvEByUc9LsKyA50lvj8eXcKYxEAGh0AzRDndwhKJr559GhZ8MKa', 'Personal de Admisión', 'ACTIVO', 1, 0, NULL, '2026-05-21 00:56:02.877328-05', '2026-05-21 00:56:02.877328-05');
INSERT INTO hospital_hc.usuario VALUES (2, 'medico', '$2a$10$x5EaRRx0Rp9BmtwzRTweL.YI2IpC4x7/PDTgsmG3G8OiPj1zVs2Hm', 'Médico Principal', 'ACTIVO', 2, 0, NULL, '2026-05-21 00:56:02.953183-05', '2026-05-21 00:56:02.953183-05');
INSERT INTO hospital_hc.usuario VALUES (3, 'admin', '$2a$10$ysBR39.8aMwYwyqODf2Vg.VH8qX3bd9uIwHlKilxfyHgY/alnDGNS', 'Administrador Principal', 'ACTIVO', 3, 0, NULL, '2026-05-21 03:53:36.594938-05', '2026-05-21 03:53:36.594938-05');
INSERT INTO hospital_hc.usuario VALUES (4, 'admision1', '$2a$10$7L7JCTC7/jDMnyLltirjo.sLSb7KtXiWpvFv4EKCOlsj2AlI/qOC6', 'Personal de Admisión 1', 'ACTIVO', 1, 0, NULL, '2026-05-21 03:53:36.678-05', '2026-05-21 03:53:36.678-05');
INSERT INTO hospital_hc.usuario VALUES (5, 'archivo1', '$2a$10$e6hCqMxSmavkOEBKaXKk7OAPMZd.HZ5TfjHAwUdjCHIPeKq49vhHa', 'Personal de Archivo 1', 'ACTIVO', 4, 0, NULL, '2026-05-21 03:53:36.755581-05', '2026-05-21 03:53:36.755581-05');
INSERT INTO hospital_hc.usuario VALUES (6, 'enfermera1', '$2a$10$ZHq7uMYC1ZtNvejzyeBw2.8TldoEZy27FhA0X1EkB.HJnWQ8wHdrG', 'Enfermera Principal 1', 'ACTIVO', 5, 0, NULL, '2026-05-21 03:53:36.834934-05', '2026-05-21 03:53:36.834934-05');
INSERT INTO hospital_hc.usuario VALUES (7, 'medico1', '$2a$10$xJtzTVG/Rq9dnznT2awn1uUa5woijI94wdK/rxYGcuilzT4.LFuaq', 'Médico de Guardia 1', 'ACTIVO', 2, 0, NULL, '2026-05-21 03:53:36.911976-05', '2026-05-21 03:53:36.911976-05');
INSERT INTO hospital_hc.usuario VALUES (8, 'medico_rios', '$2a$10$0B5XS1WTsavMVDlV9KTo0esp4WUV1J.tB.xqoM3d8uQGljLeYuoJ.', 'Dr. Alejandro Ríos', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.493346-05', '2026-05-21 18:34:33.493346-05');
INSERT INTO hospital_hc.usuario VALUES (9, 'medico_torres', '$2a$10$mkfbEB2cY1/8d6lE3doaAOcCblfvXjDNHl26XJywUNPjIf1mqvxqW', 'Dra. Elena Torres', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.588296-05', '2026-05-21 18:34:33.588296-05');
INSERT INTO hospital_hc.usuario VALUES (10, 'medico_valdivia', '$2a$10$1404bouzTjIV.Sldyq04ousRXbljb2nKbStAWQZJeSS/dpvRBMxFm', 'Dra. Sofía Valdivia', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.666493-05', '2026-05-21 18:34:33.666493-05');
INSERT INTO hospital_hc.usuario VALUES (11, 'medico_rojas', '$2a$10$zL/E6H/yBqpl9IkzJiYWLeBY9hq58YE.HAlQCJhndB3P5aqCG/R7y', 'Dr. Manuel Rojas', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.744304-05', '2026-05-21 18:34:33.744304-05');
INSERT INTO hospital_hc.usuario VALUES (12, 'medico_delgado', '$2a$10$XMfQ/Xrh6D2t3mptdpoQKuUeTi/9sDS3/jbawvsC20auCArJuRllK', 'Dr. Hugo Delgado', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.822313-05', '2026-05-21 18:34:33.822313-05');
INSERT INTO hospital_hc.usuario VALUES (13, 'medico_mendoza', '$2a$10$GHUAnQ.dZ7MtXDQxK2ya3.mPWPbAmVwQPaVDWHKxQN4UYnU41R.46', 'Dra. Patricia Mendoza', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.901557-05', '2026-05-21 18:34:33.901557-05');
INSERT INTO hospital_hc.usuario VALUES (14, 'medico_soto', '$2a$10$cxCZuCCZoJJiQwQRy/PNTunPJrVIsWpoEguH1bHF0xZNmm2heMEa.', 'Dr. Fernando Soto', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:33.978924-05', '2026-05-21 18:34:33.978924-05');
INSERT INTO hospital_hc.usuario VALUES (15, 'medico_luna', '$2a$10$PCdLxOiiZAM6lhIGVbe52O2T4r87dD3XtB5sOQPi7U.k1y6oONPBS', 'Dra. Carmen Luna', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:34.058761-05', '2026-05-21 18:34:34.058761-05');
INSERT INTO hospital_hc.usuario VALUES (16, 'medico_ortiz', '$2a$10$A3R2YtoX2ecJmQhCJ7TZQe7kIVgczdjU97mEVFaBhBjHm.gHDG4hy', 'Dr. Gabriel Ortiz', 'ACTIVO', 2, 0, NULL, '2026-05-21 18:34:34.14357-05', '2026-05-21 18:34:34.14357-05');


--
-- Name: atencion_medica_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.atencion_medica_id_seq', 1, false);


--
-- Name: auditoria_log_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.auditoria_log_id_seq', 1, false);


--
-- Name: cita_medica_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.cita_medica_id_seq', 5, true);


--
-- Name: especialidad_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.especialidad_id_seq', 8, true);


--
-- Name: historia_clinica_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.historia_clinica_id_seq', 1, false);


--
-- Name: medico_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.medico_id_seq', 9, true);


--
-- Name: paciente_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.paciente_id_seq', 2, true);


--
-- Name: receta_medica_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.receta_medica_id_seq', 1, false);


--
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.rol_id_seq', 5, true);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: hospital_hc; Owner: postgres
--

SELECT pg_catalog.setval('hospital_hc.usuario_id_seq', 16, true);


--
-- Name: atencion_medica atencion_medica_cita_id_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica
    ADD CONSTRAINT atencion_medica_cita_id_key UNIQUE (cita_id);


--
-- Name: atencion_medica atencion_medica_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica
    ADD CONSTRAINT atencion_medica_pkey PRIMARY KEY (id);


--
-- Name: auditoria_log auditoria_log_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.auditoria_log
    ADD CONSTRAINT auditoria_log_pkey PRIMARY KEY (id);


--
-- Name: cie10 cie10_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cie10
    ADD CONSTRAINT cie10_pkey PRIMARY KEY (codigo);


--
-- Name: cita_medica cita_medica_numero_ticket_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica
    ADD CONSTRAINT cita_medica_numero_ticket_key UNIQUE (numero_ticket);


--
-- Name: cita_medica cita_medica_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica
    ADD CONSTRAINT cita_medica_pkey PRIMARY KEY (id);


--
-- Name: especialidad especialidad_codigo_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.especialidad
    ADD CONSTRAINT especialidad_codigo_key UNIQUE (codigo);


--
-- Name: especialidad especialidad_nombre_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.especialidad
    ADD CONSTRAINT especialidad_nombre_key UNIQUE (nombre);


--
-- Name: especialidad especialidad_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.especialidad
    ADD CONSTRAINT especialidad_pkey PRIMARY KEY (id);


--
-- Name: historia_clinica historia_clinica_numero_historia_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.historia_clinica
    ADD CONSTRAINT historia_clinica_numero_historia_key UNIQUE (numero_historia);


--
-- Name: historia_clinica historia_clinica_paciente_id_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.historia_clinica
    ADD CONSTRAINT historia_clinica_paciente_id_key UNIQUE (paciente_id);


--
-- Name: historia_clinica historia_clinica_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.historia_clinica
    ADD CONSTRAINT historia_clinica_pkey PRIMARY KEY (id);


--
-- Name: medico medico_cip_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico
    ADD CONSTRAINT medico_cip_key UNIQUE (cip);


--
-- Name: medico medico_dni_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico
    ADD CONSTRAINT medico_dni_key UNIQUE (dni);


--
-- Name: medico medico_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico
    ADD CONSTRAINT medico_pkey PRIMARY KEY (id);


--
-- Name: medico medico_usuario_id_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico
    ADD CONSTRAINT medico_usuario_id_key UNIQUE (usuario_id);


--
-- Name: paciente paciente_dni_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.paciente
    ADD CONSTRAINT paciente_dni_key UNIQUE (dni);


--
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id);


--
-- Name: receta_medica receta_medica_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.receta_medica
    ADD CONSTRAINT receta_medica_pkey PRIMARY KEY (id);


--
-- Name: rol rol_nombre_rol_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.rol
    ADD CONSTRAINT rol_nombre_rol_key UNIQUE (nombre_rol);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- Name: idx_atencion_cie10; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_atencion_cie10 ON hospital_hc.atencion_medica USING btree (diagnostico_cie10_principal);


--
-- Name: idx_atencion_estado; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_atencion_estado ON hospital_hc.atencion_medica USING btree (estado_consulta);


--
-- Name: idx_atencion_fecha; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_atencion_fecha ON hospital_hc.atencion_medica USING btree (fecha_atencion);


--
-- Name: idx_atencion_historia; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_atencion_historia ON hospital_hc.atencion_medica USING btree (historia_clinica_id);


--
-- Name: idx_audit_usuario_fecha; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_audit_usuario_fecha ON hospital_hc.auditoria_log USING btree (usuario_id, created_at);


--
-- Name: idx_cita_estado; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_cita_estado ON hospital_hc.cita_medica USING btree (estado);


--
-- Name: idx_cita_fecha_medico; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_cita_fecha_medico ON hospital_hc.cita_medica USING btree (fecha_cita, medico_id);


--
-- Name: idx_cita_paciente; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_cita_paciente ON hospital_hc.cita_medica USING btree (paciente_id);


--
-- Name: idx_cita_ticket; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_cita_ticket ON hospital_hc.cita_medica USING btree (numero_ticket);


--
-- Name: idx_hc_numero; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE UNIQUE INDEX idx_hc_numero ON hospital_hc.historia_clinica USING btree (numero_historia);


--
-- Name: idx_hc_paciente; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE UNIQUE INDEX idx_hc_paciente ON hospital_hc.historia_clinica USING btree (paciente_id);


--
-- Name: idx_medico_cip; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE UNIQUE INDEX idx_medico_cip ON hospital_hc.medico USING btree (cip);


--
-- Name: idx_medico_especialidad; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_medico_especialidad ON hospital_hc.medico USING btree (especialidad_id);


--
-- Name: idx_paciente_apellidos; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_paciente_apellidos ON hospital_hc.paciente USING btree (apellidos);


--
-- Name: idx_paciente_dni; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE UNIQUE INDEX idx_paciente_dni ON hospital_hc.paciente USING btree (dni);


--
-- Name: idx_paciente_estado_sis; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE INDEX idx_paciente_estado_sis ON hospital_hc.paciente USING btree (estado_sis) WHERE (estado_sis = true);


--
-- Name: idx_usuario_username; Type: INDEX; Schema: hospital_hc; Owner: postgres
--

CREATE UNIQUE INDEX idx_usuario_username ON hospital_hc.usuario USING btree (username);


--
-- Name: atencion_medica atencion_medica_cita_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica
    ADD CONSTRAINT atencion_medica_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES hospital_hc.cita_medica(id);


--
-- Name: atencion_medica atencion_medica_historia_clinica_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica
    ADD CONSTRAINT atencion_medica_historia_clinica_id_fkey FOREIGN KEY (historia_clinica_id) REFERENCES hospital_hc.historia_clinica(id);


--
-- Name: atencion_medica atencion_medica_medico_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica
    ADD CONSTRAINT atencion_medica_medico_id_fkey FOREIGN KEY (medico_id) REFERENCES hospital_hc.medico(id);


--
-- Name: atencion_medica atencion_medica_triaje_realizado_por_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.atencion_medica
    ADD CONSTRAINT atencion_medica_triaje_realizado_por_fkey FOREIGN KEY (triaje_realizado_por) REFERENCES hospital_hc.usuario(id);


--
-- Name: auditoria_log auditoria_log_usuario_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.auditoria_log
    ADD CONSTRAINT auditoria_log_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES hospital_hc.usuario(id);


--
-- Name: cita_medica cita_medica_created_by_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica
    ADD CONSTRAINT cita_medica_created_by_fkey FOREIGN KEY (created_by) REFERENCES hospital_hc.usuario(id);


--
-- Name: cita_medica cita_medica_especialidad_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica
    ADD CONSTRAINT cita_medica_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES hospital_hc.especialidad(id);


--
-- Name: cita_medica cita_medica_medico_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica
    ADD CONSTRAINT cita_medica_medico_id_fkey FOREIGN KEY (medico_id) REFERENCES hospital_hc.medico(id);


--
-- Name: cita_medica cita_medica_paciente_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.cita_medica
    ADD CONSTRAINT cita_medica_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES hospital_hc.paciente(id);


--
-- Name: historia_clinica historia_clinica_created_by_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.historia_clinica
    ADD CONSTRAINT historia_clinica_created_by_fkey FOREIGN KEY (created_by) REFERENCES hospital_hc.usuario(id);


--
-- Name: historia_clinica historia_clinica_paciente_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.historia_clinica
    ADD CONSTRAINT historia_clinica_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES hospital_hc.paciente(id);


--
-- Name: medico medico_especialidad_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico
    ADD CONSTRAINT medico_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES hospital_hc.especialidad(id);


--
-- Name: medico medico_usuario_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.medico
    ADD CONSTRAINT medico_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES hospital_hc.usuario(id);


--
-- Name: receta_medica receta_medica_atencion_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.receta_medica
    ADD CONSTRAINT receta_medica_atencion_id_fkey FOREIGN KEY (atencion_id) REFERENCES hospital_hc.atencion_medica(id);


--
-- Name: usuario usuario_rol_id_fkey; Type: FK CONSTRAINT; Schema: hospital_hc; Owner: postgres
--

ALTER TABLE ONLY hospital_hc.usuario
    ADD CONSTRAINT usuario_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES hospital_hc.rol(id);


--
-- PostgreSQL database dump complete
--

-- \unrestrict ObnBg43qCD7SdRtOnQwkxR55o5TuWvcagg3RoShMlq3JFW1WY2haRVoEheXTN0r

