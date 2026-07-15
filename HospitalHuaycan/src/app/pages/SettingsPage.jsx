import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoNotificationsOutline,
  IoVolumeHighOutline,
  IoContractOutline,
  IoServerOutline,
  IoRefreshOutline,
  IoLogOutOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { BASE_URL } from "../../lib/apiClient";
import { getRoleInfo } from "../../lib/roleInfo";
import { useServerStatus } from "../../lib/useServerStatus";

const PREFS_KEY = "hh_prefs";
const DEFAULT_PREFS = { notificaciones: true, alertasSonoras: false, modoCompacto: false };

function loadPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") };
  } catch {
    return DEFAULT_PREFS;
  }
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${
        checked ? "bg-green-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { userRole, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { status, latencyMs, check } = useServerStatus();

  const [prefs, setPrefs] = useState(loadPrefs);
  const nombreCompleto = localStorage.getItem("nombreCompleto") || "Usuario";
  const roleInfo = getRoleInfo(userRole);

  const togglePref = (key) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  const prefItems = [
    {
      key: "notificaciones",
      icon: IoNotificationsOutline,
      title: "Notificaciones del sistema",
      description: "Avisos sobre citas, triaje y documentos dentro de la plataforma.",
    },
    {
      key: "alertasSonoras",
      icon: IoVolumeHighOutline,
      title: "Alertas sonoras",
      description: "Reproducir un sonido cuando llegue una notificación importante.",
    },
    {
      key: "modoCompacto",
      icon: IoContractOutline,
      title: "Modo compacto",
      description: "Reducir espacios para mostrar más información en pantalla.",
    },
  ];

  return (
    <section className="space-y-5">
      {/* Encabezado */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
          Sistema
        </p>
        <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
          Configuración
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Preferencias */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0A1733]">Preferencias</h3>
            <p className="text-[11px] text-slate-500">Se guardan en este equipo.</p>
          </div>
          <div className="p-6 space-y-5">
            {prefItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#0A1733]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0A1733]">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <Toggle checked={prefs[item.key]} onChange={() => togglePref(item.key)} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Estado del sistema */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IoServerOutline className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-[#0A1733]">Estado del sistema</h3>
              </div>
              <button
                onClick={check}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <IoRefreshOutline className="w-4 h-4" /> Verificar
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Servidor
                </span>
                {status === "checking" ? (
                  <span className="flex items-center gap-2 text-sm font-bold text-amber-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    Comprobando…
                  </span>
                ) : status === "online" ? (
                  <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    En línea{latencyMs !== null ? ` · ${latencyMs} ms` : ""}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-bold text-[#CA0000]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CA0000]" />
                    Sin conexión
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  API
                </span>
                <span className="text-xs font-mono text-slate-600 truncate">{BASE_URL}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Versión
                </span>
                <span className="text-sm font-bold text-[#0A1733]">v1.0.0</span>
              </div>
            </div>
          </div>

          {/* Cuenta */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <IoPersonOutline className="w-5 h-5 text-[#CA0000]" />
              <h3 className="text-sm font-bold text-[#0A1733]">Sesión actual</h3>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-[#0A1733]">{nombreCompleto}</p>
                <p className="text-xs text-slate-500">{roleInfo.label}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-[#CA0000] text-xs font-bold px-5 py-3 rounded-xl border border-red-100 transition-colors"
              >
                <IoLogOutOutline className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
