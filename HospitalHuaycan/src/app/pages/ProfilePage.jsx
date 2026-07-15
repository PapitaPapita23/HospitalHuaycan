import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoArrowForward,
  IoShieldCheckmarkOutline,
  IoBusinessOutline,
  IoKeyOutline,
  IoIdCardOutline,
} from "react-icons/io5";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { getRoleInfo } from "../../lib/roleInfo";

function getInitials(nombre) {
  const parts = nombre.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfilePage() {
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const nombreCompleto = localStorage.getItem("nombreCompleto") || "Usuario";
  const userId = localStorage.getItem("userId") || "—";
  const roleInfo = getRoleInfo(userRole);
  const RoleIcon = roleInfo.icon;

  const cuentaRows = [
    { label: "Nombre completo", value: nombreCompleto },
    { label: "ID de usuario", value: `#${userId}` },
    { label: "Rol asignado", value: roleInfo.label },
    { label: "Área", value: roleInfo.area },
    { label: "Institución", value: "Hospital de Huaycán — MINSA" },
  ];

  return (
    <section className="space-y-5">
      {/* Encabezado */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
          Mi cuenta
        </p>
        <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
          Perfil
        </h2>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-[#0A1733] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center gap-5 text-white">
        <div className="w-16 h-16 rounded-full bg-[#CA0000] flex items-center justify-center text-xl font-black shrink-0 shadow-lg">
          {getInitials(nombreCompleto)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50 mb-1">
            {roleInfo.area}
          </p>
          <h3 className="text-2xl font-black leading-tight truncate">{nombreCompleto}</h3>
          <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            <RoleIcon className="w-3.5 h-3.5" /> {roleInfo.label}
          </span>
        </div>
        {roleInfo.modulePath && (
          <button
            onClick={() => navigate(roleInfo.modulePath)}
            className="flex items-center gap-2 bg-[#CA0000] hover:bg-[#a80000] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-md self-start sm:self-auto"
          >
            Ir a {roleInfo.moduleLabel} <IoArrowForward className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Información de la cuenta */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <IoIdCardOutline className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-[#0A1733]">Información de la cuenta</h3>
          </div>
          <div className="p-6 space-y-4">
            {cuentaRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {row.label}
                </span>
                <span className="text-sm font-bold text-[#0A1733] text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Permisos del rol */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <IoShieldCheckmarkOutline className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-bold text-[#0A1733]">Permisos del rol</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                Asignados por el sistema
              </span>
            </div>
            <ul className="p-6 space-y-3">
              {roleInfo.permisos.map((permiso) => (
                <li key={permiso} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <IoCheckmarkCircle className="w-5 h-5 text-green-500 shrink-0" />
                  {permiso}
                </li>
              ))}
            </ul>
          </div>

          {/* Seguridad */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <IoKeyOutline className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#0A1733]">Seguridad de la cuenta</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Si necesitas cambiar tu contraseña, usa la opción de recuperación o contacta a la
                Oficina de TI.
              </p>
            </div>
            <Link
              to="/recuperar-clave"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
            >
              Cambiar contraseña
            </Link>
          </div>

          {/* Institución */}
          <div className="bg-[#ECF4FC] border border-blue-100 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-blue-100">
              <IoBusinessOutline className="w-5 h-5 text-[#0A1733]" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cuenta institucional del <span className="font-bold text-[#0A1733]">Hospital de
              Huaycán</span>, Ministerio de Salud del Perú. El acceso a cada módulo depende del rol
              asignado por el administrador.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
