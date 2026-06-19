import React, { useState, useEffect } from "react";
import {
  IoHeartOutline, IoBodyOutline, IoThermometerOutline,
  IoPulseOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline,
} from "react-icons/io5";
import { CitaMedico } from "../types";
import { registrarTriaje, TriajeRequest } from "../services/atencionService";

interface Props {
  cita: CitaMedico;
  onSuccess: () => void;
  onCancel: () => void;
}

const TriajeForm: React.FC<Props> = ({ cita, onSuccess, onCancel }) => {
  const [fr, setFr] = useState("");
  const [fc, setFc] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [paSistolica, setPaSistolica] = useState("");
  const [paDiastolica, setPaDiastolica] = useState("");
  const [spo2, setSpo2] = useState("");
  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [imc, setImc] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calcular IMC automáticamente en tiempo real
  useEffect(() => {
    const p = parseFloat(peso);
    const t = parseFloat(talla);
    if (p > 0 && t > 0) {
      const val = p / Math.pow(t / 100, 2);
      setImc(parseFloat(val.toFixed(2)));
    } else {
      setImc(null);
    }
  }, [peso, talla]);

  // Validaciones en tiempo real
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const frNum = parseInt(fr);
    if (!fr || isNaN(frNum) || frNum <= 0 || frNum > 100) {
      errs.fr = "FR debe estar entre 1 y 100 rpm";
    }

    const fcNum = parseInt(fc);
    if (!fc || isNaN(fcNum) || fcNum <= 0 || fcNum > 300) {
      errs.fc = "FC debe estar entre 1 y 300 lpm";
    }

    const tempNum = parseFloat(temperatura);
    if (!temperatura || isNaN(tempNum) || tempNum < 30 || tempNum > 45) {
      errs.temperatura = "Temperatura debe estar entre 30.0 °C y 45.0 °C";
    }

    const paSisNum = parseInt(paSistolica);
    if (!paSistolica || isNaN(paSisNum) || paSisNum < 50 || paSisNum > 250) {
      errs.paSistolica = "PA Sistólica debe estar entre 50 y 250 mmHg";
    }

    const paDiaNum = parseInt(paDiastolica);
    if (!paDiastolica || isNaN(paDiaNum) || paDiaNum < 30 || paDiaNum > 150) {
      errs.paDiastolica = "PA Diastólica debe estar entre 30 y 150 mmHg";
    }

    const spo2Num = parseFloat(spo2);
    if (!spo2 || isNaN(spo2Num) || spo2Num < 0 || spo2Num > 100) {
      errs.spo2 = "SpO2 debe estar entre 0% y 100%";
    }

    const pesoNum = parseFloat(peso);
    if (!peso || isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 400) {
      errs.peso = "Peso debe estar entre 0.1 y 400 kg";
    }

    const tallaNum = parseFloat(talla);
    if (!talla || isNaN(tallaNum) || tallaNum < 10 || tallaNum > 250) {
      errs.talla = "Talla debe estar entre 10 y 250 cm";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: TriajeRequest = {
      fr: parseInt(fr),
      fc: parseInt(fc),
      temperatura: parseFloat(temperatura),
      pa_sistolica: parseInt(paSistolica),
      pa_diastolica: parseInt(paDiastolica),
      spo2: parseFloat(spo2),
      peso: parseFloat(peso),
      talla: parseFloat(talla),
      imc: imc || 0,
    };

    try {
      await registrarTriaje(cita.citaId, payload);
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.message || "Ocurrió un error al guardar el triaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Cabecera */}
      <div className="bg-[#0A1733] px-6 py-5 flex items-center justify-between text-white">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Módulo de Triaje</p>
          <h3 className="text-base font-black">{cita.pacienteNombres}</h3>
          <p className="text-xs text-white/50">DNI: {cita.pacienteDni}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#CA0000]/10 flex items-center justify-center">
          <IoHeartOutline className="w-6 h-6 text-[#CA0000]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {submitError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[#CA0000] text-sm font-semibold">
            <IoCloseCircleOutline className="w-5 h-5 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Frecuencia Respiratoria */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Frecuencia Respiratoria (rpm)
            </label>
            <div className="relative">
              <input
                type="number"
                value={fr}
                onChange={(e) => setFr(e.target.value)}
                placeholder="Ej: 16"
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                  ${errors.fr ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
              />
            </div>
            {errors.fr && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.fr}</p>}
          </div>

          {/* Frecuencia Cardíaca */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Frecuencia Cardíaca (lpm)
            </label>
            <div className="relative">
              <input
                type="number"
                value={fc}
                onChange={(e) => setFc(e.target.value)}
                placeholder="Ej: 72"
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                  ${errors.fc ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
              />
            </div>
            {errors.fc && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.fc}</p>}
          </div>

          {/* Temperatura */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <IoThermometerOutline className="w-3.5 h-3.5 text-slate-400" />
              Temperatura (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              placeholder="Ej: 36.5"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                ${errors.temperatura ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
            />
            {errors.temperatura && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.temperatura}</p>}
          </div>

          {/* Saturación SpO2 */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Saturación de Oxígeno (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              placeholder="Ej: 98"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                ${errors.spo2 ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
            />
            {errors.spo2 && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.spo2}</p>}
          </div>

          {/* Presión Arterial */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="col-span-2 flex items-center gap-1.5 mb-1">
              <IoPulseOutline className="w-4 h-4 text-[#CA0000]" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Presión Arterial</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sistólica (mmHg)</label>
              <input
                type="number"
                value={paSistolica}
                onChange={(e) => setPaSistolica(e.target.value)}
                placeholder="Ej: 120"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                  ${errors.paSistolica ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
              />
              {errors.paSistolica && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.paSistolica}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Diastólica (mmHg)</label>
              <input
                type="number"
                value={paDiastolica}
                onChange={(e) => setPaDiastolica(e.target.value)}
                placeholder="Ej: 80"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                  ${errors.paDiastolica ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
              />
              {errors.paDiastolica && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.paDiastolica}</p>}
            </div>
          </div>

          {/* Peso y Talla */}
          <div className="sm:col-span-2 grid grid-cols-3 gap-4 bg-blue-50/35 p-4 rounded-xl border border-blue-100/40">
            <div className="col-span-3 flex items-center gap-1.5 mb-1">
              <IoBodyOutline className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Antropometría</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ej: 70"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                  ${errors.peso ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
              />
              {errors.peso && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.peso}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Talla (cm)</label>
              <input
                type="number"
                step="0.1"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                placeholder="Ej: 170"
                className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all
                  ${errors.talla ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
              />
              {errors.talla && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.talla}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">IMC (Autocalculado)</label>
              <div className="w-full bg-slate-100 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 h-10 flex items-center">
                {imc !== null ? imc : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0A1733] hover:bg-[#CA0000] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                Guardando...
              </>
            ) : (
              <>
                <IoCheckmarkCircleOutline className="w-4 h-4" />
                Registrar Triaje
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TriajeForm;
