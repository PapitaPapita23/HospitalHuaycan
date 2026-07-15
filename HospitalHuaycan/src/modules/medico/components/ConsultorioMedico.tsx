import React, { useState, useEffect } from "react";
import {
  IoPulseOutline, IoChevronDownOutline, IoAlertCircleOutline,
  IoCheckmarkCircleOutline, IoTrashOutline, IoAddOutline,
  IoMedicalOutline, IoCloseCircleOutline, IoBookOutline,
  IoPrintOutline
} from "react-icons/io5";
import { CitaMedico } from "../types";
import { registrarConsulta, buscarCie10, Cie10Diagnostico, MedicamentoReceta, ConsultaRequest } from "../services/atencionService";
import { printReceta } from "../utils/printReceta";

interface Props {
  cita: CitaMedico;
  onSuccess: () => void;
  onCancel: () => void;
}

const FORMAS_FARMACEUTICAS = [
  "Tableta / Comprimido", "Cápsula", "Jarabe", "Suspensión", 
  "Inyectable (Ampolla)", "Crema / Pomada", "Gotas Oftálmicas", 
  "Inhalador / Aerosol", "Parche", "Supositorio"
];

const ConsultorioMedico: React.FC<Props> = ({ cita, onSuccess, onCancel }) => {
  // Datos de Consulta
  const [anamnesis, setAnamnesis] = useState("");
  const [examenFisico, setExamenFisico] = useState("");
  const [diagnosticoCie10Principal, setDiagnosticoCie10Principal] = useState("");
  const [principalDesc, setPrincipalDesc] = useState("");
  const [diagnosticosSecundarios, setDiagnosticosSecundarios] = useState<string[]>([]);
  const [tratamiento, setTratamiento] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [medicamentos, setMedicamentos] = useState<MedicamentoReceta[]>([]);

  // Estados de Medicamento en Edición
  const [medNombre, setMedNombre] = useState("");
  const [medConcentracion, setMedConcentracion] = useState("");
  const [medForma, setMedForma] = useState(FORMAS_FARMACEUTICAS[0]);
  const [medDosis, setMedDosis] = useState("");
  const [medFrecuencia, setMedFrecuencia] = useState("");
  const [medDias, setMedDias] = useState("");
  const [medIndicaciones, setMedIndicaciones] = useState("");

  // Búsqueda CIE-10
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Cie10Diagnostico[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cieSearchError, setCieSearchError] = useState<string | null>(null);

  // Estados Generales
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Obtener signos vitales del triaje registrado hoy (el primer elemento del historial si corresponde a hoy)
  const currentTriaje = cita.historialConsultas && cita.historialConsultas.length > 0
    ? cita.historialConsultas[0]
    : null;

  // Debounce para búsqueda CIE-10
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setCieSearchError(null);
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await buscarCie10(searchTerm);
        setSearchResults(results);
      } catch (err: any) {
        setCieSearchError("Error al buscar códigos CIE-10.");
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelectCie10 = (item: Cie10Diagnostico) => {
    setDiagnosticoCie10Principal(item.codigo);
    setPrincipalDesc(item.descripcion);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleAddSecondaryCie10 = (item: Cie10Diagnostico) => {
    const codeStr = `[${item.codigo}] ${item.descripcion}`;
    if (!diagnosticosSecundarios.includes(codeStr)) {
      setDiagnosticosSecundarios([...diagnosticosSecundarios, codeStr]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveSecondary = (index: number) => {
    setDiagnosticosSecundarios(diagnosticosSecundarios.filter((_, i) => i !== index));
  };

  const handleAddMedicamento = () => {
    if (!medNombre.trim() || !medDosis.trim() || !medFrecuencia.trim() || !medDias) {
      alert("Por favor complete los campos obligatorios del medicamento (Nombre, Dosis, Frecuencia y Días).");
      return;
    }

    const nuevoMed: MedicamentoReceta = {
      medicamento: medNombre.trim(),
      concentracion: medConcentracion.trim(),
      forma_farmaceutica: medForma,
      dosis: medDosis.trim(),
      frecuencia: medFrecuencia.trim(),
      duracion_dias: parseInt(medDias),
      indicaciones_especiales: medIndicaciones.trim() || undefined,
    };

    setMedicamentos([...medicamentos, nuevoMed]);

    // Limpiar campos de medicamento
    setMedNombre("");
    setMedConcentracion("");
    setMedForma(FORMAS_FARMACEUTICAS[0]);
    setMedDosis("");
    setMedFrecuencia("");
    setMedDias("");
    setMedIndicaciones("");
  };

  const handleRemoveMedicamento = (index: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    printReceta({
      pacienteNombres: cita.pacienteNombres,
      pacienteDni: cita.pacienteDni,
      citaId: cita.citaId,
      diagnosticoPrincipalCodigo: diagnosticoCie10Principal || undefined,
      diagnosticoPrincipalDescripcion: principalDesc || undefined,
      diagnosticosSecundarios: diagnosticosSecundarios,
      medicamentos: medicamentos,
      tratamiento: tratamiento || undefined,
      indicaciones: indicaciones || undefined
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!anamnesis.trim()) errs.anamnesis = "La anamnesis es obligatoria.";
    if (!examenFisico.trim()) errs.examenFisico = "El examen físico es obligatorio.";
    if (!diagnosticoCie10Principal) errs.cie10 = "Debe seleccionar un diagnóstico principal CIE-10.";
    if (!tratamiento.trim()) errs.tratamiento = "El plan de tratamiento es obligatorio.";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: ConsultaRequest = {
      anamnesis: anamnesis.trim(),
      examen_fisico: examenFisico.trim(),
      diagnostico_cie10_principal: diagnosticoCie10Principal,
      diagnosticos_secundarios: diagnosticosSecundarios,
      tratamiento: tratamiento.trim(),
      indicaciones: indicaciones.trim(),
      medicamentos: medicamentos,
    };


    try {
      await registrarConsulta(cita.citaId, payload);
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.message || "Error al finalizar la consulta médica.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Cabecera del Paciente */}
      <div className="bg-[#0A1733] px-6 py-5 flex flex-wrap items-center justify-between text-white gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Consulta Médica</p>
          <h3 className="text-lg font-black">{cita.pacienteNombres}</h3>
          <p className="text-xs text-white/50">DNI: {cita.pacienteDni} • Cita #{cita.citaId}</p>
        </div>
        
        {/* Signos Vitales del Triaje */}
        {currentTriaje ? (
          <div className="flex flex-wrap gap-3 bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
            <div className="text-center px-2 border-r border-white/10">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Temp</span>
              <span className="font-bold">{currentTriaje.temperatura} °C</span>
            </div>
            <div className="text-center px-2 border-r border-white/10">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">PA</span>
              <span className="font-bold">{currentTriaje.paSistolica}/{currentTriaje.paDiastolica}</span>
            </div>
            <div className="text-center px-2 border-r border-white/10">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">FC</span>
              <span className="font-bold">{currentTriaje.fc} lpm</span>
            </div>
            <div className="text-center px-2 border-r border-white/10">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">SpO2</span>
              <span className="font-bold">{currentTriaje.spo2} %</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">IMC</span>
              <span className="font-bold">{currentTriaje.imc}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl p-2.5">
            ⚠ Sin triaje registrado para hoy
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {submitError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[#CA0000] text-sm font-semibold">
            <IoCloseCircleOutline className="w-5 h-5 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}

        {/* 1. Anamnesis y Examen Físico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Anamnesis *
            </label>
            <textarea
              value={anamnesis}
              onChange={(e) => setAnamnesis(e.target.value)}
              placeholder="Ingresar motivo de consulta, síntomas del paciente y antecedentes relevantes..."
              rows={5}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                ${errors.anamnesis ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
            />
            {errors.anamnesis && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.anamnesis}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Examen Físico *
            </label>
            <textarea
              value={examenFisico}
              onChange={(e) => setExamenFisico(e.target.value)}
              placeholder="Describir los hallazgos en la exploración física general y por sistemas..."
              rows={5}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                ${errors.examenFisico ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
            />
            {errors.examenFisico && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.examenFisico}</p>}
          </div>
        </div>

        {/* 2. Buscador CIE-10 (Autocompletado con Debounce) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
            <IoBookOutline className="w-4 h-4 text-slate-500" />
            Catálogo Diagnóstico CIE-10
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Buscar Enfermedad (Código o Descripción)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escriba ej: 'Hipertensión' o 'I10'..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-400"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3.5">
                    <div className="animate-spin w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full" />
                  </div>
                )}
              </div>
              
              {cieSearchError && <p className="text-[10px] text-red-500 mt-1">{cieSearchError}</p>}

              {/* Resultados desplegables */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 left-5 right-5 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-52 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((item) => (
                    <div
                      key={item.codigo}
                      className="px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="font-semibold">
                        <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-2">{item.codigo}</span>
                        {item.descripcion}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectCie10(item)}
                          className="bg-[#0A1733] hover:bg-[#CA0000] text-white font-bold px-2.5 py-1 rounded text-[10px] transition-colors"
                        >
                          Principal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSecondaryCie10(item)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 rounded text-[10px] transition-colors"
                        >
                          + Secundario
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnóstico Principal Seleccionado */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Diagnóstico Principal</span>
                {diagnosticoCie10Principal ? (
                  <div className="text-sm font-bold text-slate-800">
                    <span className="bg-[#CA0000]/10 text-[#CA0000] font-black px-2 py-0.5 rounded mr-2">{diagnosticoCie10Principal}</span>
                    {principalDesc}
                  </div>
                ) : (
                  <span className="text-xs italic text-slate-400">Ninguno seleccionado *</span>
                )}
              </div>
              {diagnosticoCie10Principal && (
                <button
                  type="button"
                  onClick={() => { setDiagnosticoCie10Principal(""); setPrincipalDesc(""); }}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Cambiar
                </button>
              )}
            </div>
            {errors.cie10 && <p className="text-[10px] text-red-500 font-bold">{errors.cie10}</p>}

            {/* Diagnósticos Secundarios */}
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnósticos Secundarios</span>
              {diagnosticosSecundarios.length === 0 ? (
                <p className="text-xs italic text-slate-400">No hay diagnósticos secundarios agregados.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {diagnosticosSecundarios.map((sec, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-200 text-slate-700 font-bold pl-2.5 pr-1 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      {sec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSecondary(idx)}
                        className="w-4 h-4 rounded-full bg-slate-350 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-[10px] font-black"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Tratamiento e Indicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Tratamiento Clínico (Plan)*
            </label>
            <textarea
              value={tratamiento}
              onChange={(e) => setTratamiento(e.target.value)}
              placeholder="Prescribir terapia clínica general, procedimientos y exámenes complementarios..."
              rows={4}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                ${errors.tratamiento ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
            />
            {errors.tratamiento && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.tratamiento}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Indicaciones Generales
            </label>
            <textarea
              value={indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
              placeholder="Instrucciones higiénico-dietéticas, cuidados, cuándo retornar a consulta, signos de alarma..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* 4. Módulo de Receta Médica Dinámica */}
        <div className="bg-blue-50/20 p-5 rounded-2xl border border-blue-100/40">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5 mb-0">
              <IoMedicalOutline className="w-4 h-4 text-blue-600" />
              Receta Médica Digital
            </h4>
            {medicamentos.length > 0 && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <IoPrintOutline className="w-4 h-4" />
                Imprimir Receta / PDF
              </button>
            )}
          </div>

          {/* Formulario Agregar Medicamento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-white p-4 rounded-xl border border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Medicamento *</label>
              <input
                type="text"
                value={medNombre}
                onChange={(e) => setMedNombre(e.target.value)}
                placeholder="Ej: Paracetamol"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Concentración</label>
              <input
                type="text"
                value={medConcentracion}
                onChange={(e) => setMedConcentracion(e.target.value)}
                placeholder="Ej: 500 mg"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Forma Farmacéutica</label>
              <select
                value={medForma}
                onChange={(e) => setMedForma(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                {FORMAS_FARMACEUTICAS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Dosis *</label>
              <input
                type="text"
                value={medDosis}
                onChange={(e) => setMedDosis(e.target.value)}
                placeholder="Ej: 1 tableta"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Frecuencia *</label>
              <input
                type="text"
                value={medFrecuencia}
                onChange={(e) => setMedFrecuencia(e.target.value)}
                placeholder="Ej: Cada 8 horas"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Duración (Días) *</label>
              <input
                type="number"
                value={medDias}
                onChange={(e) => setMedDias(e.target.value)}
                placeholder="Ej: 5"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Indicaciones Especiales</label>
              <input
                type="text"
                value={medIndicaciones}
                onChange={(e) => setMedIndicaciones(e.target.value)}
                placeholder="Ej: Tomar después de los alimentos"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={handleAddMedicamento}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                <IoAddOutline className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>

          {/* Tabla de Medicamentos agregados */}
          {medicamentos.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs italic">
              No se han agregado medicamentos a la receta.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 font-bold text-slate-600">
                    <th className="p-3">Medicamento</th>
                    <th className="p-3">Dosis / Frecuencia</th>
                    <th className="p-3">Días</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicamentos.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <span className="font-bold text-slate-800">{med.medicamento}</span>
                        {med.concentracion && <span className="text-slate-400 ml-1.5">({med.concentracion})</span>}
                        <span className="block text-[10px] text-slate-450 mt-0.5">{med.forma_farmaceutica}</span>
                        {med.indicaciones_especiales && (
                          <span className="block text-[10px] text-blue-500 italic mt-0.5">Note: {med.indicaciones_especiales}</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-700 font-medium">
                        {med.dosis} • {med.frecuencia}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{med.duracion_dias} días</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicamento(idx)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <IoTrashOutline className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Botones de Envío */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
          {medicamentos.length > 0 && (
            <button
              type="button"
              onClick={handlePrint}
              className="mr-auto flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <IoPrintOutline className="w-4 h-4" />
              Imprimir Receta (PDF)
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0A1733] hover:bg-[#CA0000] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                Guardando Consulta...
              </>
            ) : (
              <>
                <IoCheckmarkCircleOutline className="w-4 h-4" />
                Finalizar Consulta
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ConsultorioMedico;
