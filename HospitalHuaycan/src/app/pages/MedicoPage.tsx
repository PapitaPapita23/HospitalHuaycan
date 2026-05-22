import React, { useContext } from "react";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { IoPulseOutline } from "react-icons/io5";

const MedicoPage: React.FC = () => {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <IoPulseOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0A1733]">Portal del Médico</h2>
            <p className="text-sm text-slate-500">Panel para la atención de consultas médicas y diagnóstico.</p>
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
          <h3 className="text-lg font-bold text-slate-700">Módulo del Médico</h3>
          <p className="text-sm text-slate-400">
            Aquí los médicos visualizan su lista de pacientes en espera para el turno activo, editan la anamnesis y completan recetas médicas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicoPage;
