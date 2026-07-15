import { useContext, useState } from "react";
import {
  IoCallOutline,
  IoMailOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoChevronDown,
  IoRefreshOutline,
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoHelpBuoyOutline,
} from "react-icons/io5";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { getRoleInfo } from "../../lib/roleInfo";
import { useServerStatus } from "../../lib/useServerStatus";

const FAQ_POR_ROL = {
  ROLE_ADMISION: [
    {
      q: "¿Cómo registro un paciente nuevo?",
      a: "En el módulo Admisión, busca primero por DNI para evitar duplicados. Si el paciente no existe, completa sus datos personales y guarda; el sistema le asignará una historia clínica.",
    },
    {
      q: "¿Cómo agendo una cita médica?",
      a: "Busca al paciente por DNI, selecciona la especialidad, el médico y el turno (mañana o tarde). Al confirmar, el sistema genera un ticket con código único que puedes imprimir.",
    },
  ],
  ROLE_MEDICO: [
    {
      q: "¿Dónde veo mis atenciones del día?",
      a: "En el módulo Médico aparece tu agenda del día con los pacientes asignados y su triaje ya registrado por enfermería.",
    },
    {
      q: "¿Cómo emito e imprimo una receta?",
      a: "Al finalizar la consulta, registra el diagnóstico (CIE-10) y el tratamiento. Con la opción de imprimir receta se genera el formato listo para entregar al paciente.",
    },
  ],
  ROLE_ENFERMERIA: [
    {
      q: "¿Cómo registro el triaje de un paciente?",
      a: "En el módulo Triaje selecciona al paciente de la agenda del día, registra sus signos vitales y guarda; el paciente pasará automáticamente a la cola de consulta médica.",
    },
  ],
  ROLE_ARCHIVO: [
    {
      q: "¿Cómo digitalizo documentos con el celular?",
      a: "En el módulo Archivo, dentro del expediente del paciente, abre la pestaña «Celular (QR)», escanea el código con la cámara del teléfono y toma las fotos; aparecerán en la PC automáticamente.",
    },
    {
      q: "¿Qué hace el escaneo con IA (OCR)?",
      a: "Extrae el texto de las imágenes digitalizadas para que el contenido del documento quede registrado y sea consultable junto al expediente.",
    },
  ],
};

const FAQ_GENERAL = [
  {
    q: "Olvidé mi contraseña, ¿qué hago?",
    a: "Usa la opción «Recuperar contraseña» en la pantalla de inicio de sesión. Si no recuperas el acceso, acércate a la Oficina de TI con tu DNI institucional.",
  },
  {
    q: "El sistema está lento o sin conexión",
    a: "Revisa el estado del servidor en la parte superior de esta página. Si figura «Sin conexión», espera unos minutos y vuelve a intentar; si el problema persiste, repórtalo a soporte indicando tu módulo y la hora del incidente.",
  },
];

const CONTACTOS = [
  {
    icon: IoCallOutline,
    label: "Central telefónica",
    value: "(01) 494-2323 · Anexo 114",
  },
  {
    icon: IoMailOutline,
    label: "Correo de soporte",
    value: "soporte.ti@hospitalhuaycan.gob.pe",
  },
  {
    icon: IoTimeOutline,
    label: "Horario de atención",
    value: "Lun – Sáb · 7:30 a. m. – 7:30 p. m.",
  },
  {
    icon: IoLocationOutline,
    label: "Oficina de TI",
    value: "2.º piso · Área administrativa",
  },
];

export default function SupportPage() {
  const { userRole } = useContext(AuthContext);
  const { status, latencyMs, check } = useServerStatus();
  const [openIdx, setOpenIdx] = useState(0);

  const roleInfo = getRoleInfo(userRole);
  const faqs = [...(FAQ_POR_ROL[userRole] ?? []), ...FAQ_GENERAL];

  return (
    <section className="space-y-5">
      {/* Encabezado */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
          Ayuda
        </p>
        <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
          Soporte
        </h2>
      </div>

      {/* Estado del servicio */}
      <div
        className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
          status === "offline"
            ? "bg-red-50 border-red-100"
            : "bg-white border-slate-100 shadow-sm"
        }`}
      >
        {status === "checking" ? (
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          </div>
        ) : status === "online" ? (
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <IoCheckmarkCircle className="w-6 h-6 text-green-500" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center shrink-0">
            <IoCloseCircleOutline className="w-6 h-6 text-[#CA0000]" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-[#0A1733]">
            {status === "checking"
              ? "Comprobando el estado del servicio…"
              : status === "online"
              ? "Todos los servicios operativos"
              : "No hay conexión con el servidor"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {status === "online"
              ? `Conexión con el servidor verificada${latencyMs !== null ? ` en ${latencyMs} ms` : ""}.`
              : status === "offline"
              ? "Verifica tu conexión a internet o inténtalo nuevamente en unos minutos."
              : "Consultando al servidor del hospital."}
          </p>
        </div>
        <button
          onClick={check}
          className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 border border-slate-200 rounded-xl"
        >
          <IoRefreshOutline className="w-4 h-4" /> Verificar de nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* FAQ */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0A1733]">Preguntas frecuentes</h3>
            <p className="text-[11px] text-slate-500">
              Guía rápida para {roleInfo.label.toLowerCase()}.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={faq.q}>
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-sm font-bold text-[#0A1733]">{faq.q}</span>
                  <IoChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openIdx === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIdx === idx && (
                  <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <IoHelpBuoyOutline className="w-5 h-5 text-[#CA0000]" />
              <h3 className="text-sm font-bold text-[#0A1733]">Contacto directo</h3>
            </div>
            <div className="p-6 space-y-4">
              {CONTACTOS.map((contacto) => {
                const Icon = contacto.icon;
                return (
                  <div key={contacto.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#0A1733]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {contacto.label}
                      </p>
                      <p className="text-sm font-bold text-[#0A1733] truncate">{contacto.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0A1733] rounded-2xl p-6 text-white">
            <h4 className="text-sm font-bold mb-1.5">¿Reportas un incidente?</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Indica siempre tu <span className="font-bold text-white">módulo</span> ({roleInfo.moduleLabel ?? "Panel general"}),
              la <span className="font-bold text-white">hora</span> del problema y una breve
              descripción. Así el equipo de TI podrá atenderte más rápido.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
