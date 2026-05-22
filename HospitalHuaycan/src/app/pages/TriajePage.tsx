import React, { useContext } from "react";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { IoHeartHalfOutline } from "react-icons/io5";

const TriajePage: React.FC = () => {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <IoHeartHalfOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0A1733]">Portal de Triaje y Enfermería</h2>
            <p className="text-sm text-slate-500">Panel para la toma de funciones vitales y clasificación de pacientes.</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-all"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center py-12">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-lg font-bold text-slate-700">Módulo de Triaje</h3>
          <p className="text-sm text-slate-400">
            Aquí el personal de enfermería registra los signos vitales del paciente (presión, pulso, temperatura, peso) y clasifica la prioridad de atención médica.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TriajePage;
