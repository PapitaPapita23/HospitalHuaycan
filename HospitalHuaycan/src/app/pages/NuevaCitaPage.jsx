import React from "react";
import CitaForm from "../../modules/admision/components/CitaForm";
import { IoCalendarOutline } from "react-icons/io5";

export default function NuevaCitaPage() {
  return (
    <section className="max-w-2xl mx-auto py-4">
      {/* Encabezado de la página */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <IoCalendarOutline className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#0A1733]">Agendar Nueva Cita</h2>
          <p className="text-sm text-slate-500">
            Formulario de admisión para el registro de citas médicas de pacientes
          </p>
        </div>
      </div>

      {/* Contenedor del Formulario con diseño premium */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <CitaForm />
      </div>
    </section>
  );
}
