import React, { useState } from "react";
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoMedicalOutline, 
  IoCardOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from "react-icons/io5";

// Definición de tipos para el estado del formulario
interface FormState {
  dni: string;
  especialidad: string;
  fecha: string;
  turno: "MANANA" | "TARDE";
}

interface FormErrors {
  dni?: string;
  especialidad?: string;
  fecha?: string;
}

const CitaForm: React.FC = () => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState<FormState>({
    dni: "",
    especialidad: "",
    fecha: "",
    turno: "MANANA",
  });

  // Estado para los errores de validación
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Estados para simular la petición de guardado
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Especialidades médicas para el select
  const especialidades = [
    "Medicina General",
    "Pediatría",
    "Cardiología",
    "Ginecología",
    "Oftalmología",
    "Traumatología",
    "Odontología"
  ];

  // Obtener la fecha de hoy en formato local YYYY-MM-DD
  const getTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Validaciones del formulario
  const validate = (data: FormState): FormErrors => {
    const tempErrors: FormErrors = {};

    // DNI: Exactamente 8 caracteres numéricos
    if (!data.dni) {
      tempErrors.dni = "El DNI del paciente es obligatorio.";
    } else if (!/^\d{8}$/.test(data.dni)) {
      tempErrors.dni = "El DNI debe tener exactamente 8 caracteres numéricos.";
    }

    // Especialidad: No puede estar vacía
    if (!data.especialidad) {
      tempErrors.especialidad = "Debe seleccionar una especialidad médica.";
    }

    // Fecha: No puede ser anterior a hoy
    if (!data.fecha) {
      tempErrors.fecha = "La fecha de la cita es obligatoria.";
    } else {
      const selectedDate = data.fecha;
      const today = getTodayString();
      if (selectedDate < today) {
        tempErrors.fecha = "La fecha seleccionada no puede ser anterior al día de hoy.";
      }
    }

    return tempErrors;
  };

  // Manejar el cambio en el DNI (solo permite números e ingresos de max 8 dígitos)
  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setFormData((prev) => ({ ...prev, dni: value }));

    if (touched.dni) {
      const validationErrors = validate({ ...formData, dni: value });
      setErrors((prev) => ({ ...prev, dni: validationErrors.dni }));
    }
  };

  // Manejador genérico de cambios para otros inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (touched[name]) {
      const validationErrors = validate(updatedData);
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name as keyof FormErrors] }));
    }
  };

  // Manejador de Blur para disparar validación al salir del campo
  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: validationErrors[name as keyof FormErrors] }));
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como "tocados" para mostrar errores si los hay
    setTouched({
      dni: true,
      especialidad: true,
      fecha: true,
      turno: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    // Si no hay errores, simulamos el envío de datos
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simular llamada de red de 1.5s
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        console.log("Cita médica registrada con éxito:", formData);
      }, 1500);
    }
  };

  // Resetear el formulario para programar otra cita
  const handleReset = () => {
    setFormData({
      dni: "",
      especialidad: "",
      fecha: "",
      turno: "MANANA",
    });
    setErrors({});
    setTouched({});
    setSubmitSuccess(false);
  };

  // Si se registró con éxito, mostrar vista de confirmación premium
  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <IoCheckmarkCircleOutline className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#0A1733] mb-2">¡Cita Agendada Exitosamente!</h3>
        <p className="text-slate-500 max-w-sm mb-6 text-sm">
          La cita médica ha sido registrada en el sistema de admisión del hospital.
        </p>

        {/* Resumen de la cita */}
        <div className="w-full max-w-md bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6 text-left shadow-sm">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 border-b pb-1.5">
            Detalles de la Cita
          </h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Paciente DNI:</span>
              <span className="font-semibold text-slate-700">{formData.dni}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Especialidad:</span>
              <span className="font-semibold text-slate-700">{formData.especialidad}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Fecha:</span>
              <span className="font-semibold text-slate-700">
                {new Date(formData.fecha + "T00:00:00").toLocaleDateString("es-PE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Turno:</span>
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                  formData.turno === "MANANA" ? "bg-amber-400" : "bg-indigo-400"
                }`} />
                {formData.turno === "MANANA" ? "Mañana" : "Tarde"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-[#0A1733] hover:bg-[#122854] text-white font-medium rounded-lg text-sm transition-all duration-300 hover:shadow-md cursor-pointer"
        >
          Registrar Nueva Cita
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Paciente DNI */}
      <div>
        <label htmlFor="dni" className="flex items-center gap-1.5 text-[#0A1733] text-sm font-semibold mb-1.5">
          <IoCardOutline className="text-slate-400 w-4 h-4" />
          DNI del Paciente
        </label>
        <div className="relative">
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleDniChange}
            onBlur={() => handleBlur("dni")}
            maxLength={8}
            placeholder="Ingrese el DNI (8 dígitos)"
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-700 placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:ring-4 ${
              errors.dni && touched.dni
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
            }`}
          />
        </div>
        {touched.dni && errors.dni && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs font-medium animate-slideUp">
            <IoAlertCircleOutline className="w-4 h-4 flex-shrink-0" />
            <span>{errors.dni}</span>
          </div>
        )}
      </div>

      {/* Especialidad */}
      <div>
        <label htmlFor="especialidad" className="flex items-center gap-1.5 text-[#0A1733] text-sm font-semibold mb-1.5">
          <IoMedicalOutline className="text-slate-400 w-4 h-4" />
          Especialidad
        </label>
        <select
          id="especialidad"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          onBlur={() => handleBlur("especialidad")}
          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-700 placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:ring-4 ${
            errors.especialidad && touched.especialidad
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
          }`}
        >
          <option value="">Seleccione especialidad</option>
          {especialidades.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
        {touched.especialidad && errors.especialidad && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs font-medium animate-slideUp">
            <IoAlertCircleOutline className="w-4 h-4 flex-shrink-0" />
            <span>{errors.especialidad}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha de la Cita */}
        <div>
          <label htmlFor="fecha" className="flex items-center gap-1.5 text-[#0A1733] text-sm font-semibold mb-1.5">
            <IoCalendarOutline className="text-slate-400 w-4 h-4" />
            Fecha de la Cita
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            min={getTodayString()}
            onChange={handleChange}
            onBlur={() => handleBlur("fecha")}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-700 placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:ring-4 ${
              errors.fecha && touched.fecha
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
            }`}
          />
          {touched.fecha && errors.fecha && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs font-medium animate-slideUp">
              <IoAlertCircleOutline className="w-4 h-4 flex-shrink-0" />
              <span>{errors.fecha}</span>
            </div>
          )}
        </div>

        {/* Turno */}
        <div>
          <label htmlFor="turno" className="flex items-center gap-1.5 text-[#0A1733] text-sm font-semibold mb-1.5">
            <IoTimeOutline className="text-slate-400 w-4 h-4" />
            Turno
          </label>
          <select
            id="turno"
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
          >
            <option value="MANANA">MANANA</option>
            <option value="TARDE">TARDE</option>
          </select>
        </div>
      </div>

      {/* Botón Guardar / Cargar */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium text-sm transition-all duration-300 shadow-sm cursor-pointer ${
            isSubmitting
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/10 active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Guardando cita...
            </>
          ) : (
            "Guardar Cita"
          )}
        </button>
      </div>
    </form>
  );
};

export default CitaForm;
