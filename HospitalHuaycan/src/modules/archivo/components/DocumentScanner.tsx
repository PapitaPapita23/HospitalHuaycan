import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import {
  IoCloudUploadOutline,
  IoCameraOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoScanOutline,
  IoRefreshOutline,
  IoImageOutline,
  IoPhonePortraitOutline,
  IoTrashOutline
} from "react-icons/io5";
import { supabase } from "../../../lib/supabase";
import { apiPost, BASE_URL } from "../../../lib/apiClient";

interface Props {
  historiaClinicaId: number;
}

type Tab = "archivo" | "camara" | "celular";
type OcrStatus = "idle" | "procesando" | "listo" | "error";

const DocumentScanner: React.FC<Props> = ({ historiaClinicaId }) => {
  const [tab, setTab] = useState<Tab>("archivo");

  // Archivo
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Cámara PC
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Celular (QR)
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  const [sessionId] = useState(() => generateUUID());
  const [mobileImages, setMobileImages] = useState<string[]>([]);
  const qrUrl = `${window.location.protocol}//${window.location.host}/mobile-upload/${sessionId}`;

  // OCR
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [ocrTexts, setOcrTexts] = useState<string[]>([]);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Upload Metadatos
  const [nombreBase, setNombreBase] = useState("");
  const [fechaDocumento, setFechaDocumento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("historia_clinica");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ── Polling para Celular ──────────────────────────────────────────────────
  useEffect(() => {
    let interval: any;
    if (tab === "celular") {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${BASE_URL}/mobile-sync/${sessionId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.images && data.images.length > mobileImages.length) {
              setMobileImages(data.images);
              setOcrStatus("idle"); // reset OCR if new image arrives
            }
          }
        } catch (e) {
          // ignore
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [tab, sessionId, mobileImages.length]);

  // Limpiar sesión al desmontar
  useEffect(() => {
    return () => {
      fetch(`${BASE_URL}/mobile-sync/${sessionId}`, { method: "DELETE" }).catch(() => {});
    };
  }, [sessionId]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setCapturedImage(null);
    // mobileImages se mantienen a menos que se borren manualmente
    setOcrTexts([]);
    setOcrStatus("idle");
    setOcrProgress(0);
    setMessage({ type: "", text: "" });
  };

  const getImagesToProcess = (): string[] => {
    if (tab === "archivo") return preview ? [preview] : [];
    if (tab === "camara") return capturedImage ? [capturedImage] : [];
    if (tab === "celular") return mobileImages;
    return [];
  };

  const hasContent = tab === "archivo" ? !!file : tab === "camara" ? !!capturedImage : mobileImages.length > 0;

  // ── Eventos ────────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setNombreBase(f.name.split('.')[0]); // auto-nombre
    setOcrTexts([]);
    setOcrStatus("idle");
    setMessage({ type: "", text: "" });

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const capturePc = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setCapturedImage(img);
      setOcrTexts([]);
      setOcrStatus("idle");
    }
  }, []);

  const clearMobileImages = () => {
    setMobileImages([]);
    setOcrTexts([]);
    setOcrStatus("idle");
    fetch(`${BASE_URL}/mobile-sync/${sessionId}`, { method: "DELETE" }).catch(() => {});
  };

  // ── OCR Secuencial ────────────────────────────────────────────────────────
  const runOcr = async () => {
    const images = getImagesToProcess();
    if (images.length === 0) return;

    setOcrStatus("procesando");
    setOcrProgress(0);
    const newTexts: string[] = [];

    try {
      for (let i = 0; i < images.length; i++) {
        // Simulación visual del progreso
        const baseProgress = (i / images.length) * 100;
        setOcrProgress(baseProgress + 10);

        const res = await fetch(`${BASE_URL}/ocr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: images[i] }),
        });

        if (!res.ok) throw new Error("Error OCR");
        const data = await res.json();
        newTexts.push(data.text ?? "");
        
        setOcrProgress(((i + 1) / images.length) * 100);
      }

      setOcrTexts(newTexts);
      setOcrStatus("listo");
    } catch {
      setOcrStatus("error");
    }
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!hasContent) {
      setMessage({ type: "error", text: "Seleccione o capture contenido." });
      return;
    }
    if (!fechaDocumento) {
      setMessage({ type: "error", text: "Ingrese la fecha original del documento." });
      return;
    }
    if (!nombreBase) {
      setMessage({ type: "error", text: "Ingrese un nombre base para los archivos." });
      return;
    }

    try {
      setIsUploading(true);
      const images = getImagesToProcess();

      // Caso 1: Archivo PDF u otra cosa sin preview
      if (tab === "archivo" && file && !preview) {
        const fileName = `${Date.now()}_HC${historiaClinicaId}_${file.name.replace(/\s+/g, "_")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("historias_antiguas").upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("historias_antiguas").getPublicUrl(uploadData.path);

        await apiPost("/documentos-escaneados", {
          historiaClinicaId,
          nombreArchivo: nombreBase,
          urlArchivo: urlData.publicUrl,
          fechaDocumento,
          tipoDocumento,
          textoOcr: null,
        });
      } 
      // Caso 2: Imágenes (1 o múltiples)
      else if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const res = await fetch(images[i]);
          const blob = await res.blob();
          const suffix = images.length > 1 ? ` - Pág ${i + 1}` : "";
          const finalName = `${nombreBase}${suffix}`;
          const storageFileName = `${Date.now()}_HC${historiaClinicaId}_p${i}.jpg`;

          const { data: uploadData, error: uploadError } = await supabase.storage.from("historias_antiguas").upload(storageFileName, blob, { contentType: "image/jpeg" });
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("historias_antiguas").getPublicUrl(uploadData.path);

          await apiPost("/documentos-escaneados", {
            historiaClinicaId,
            nombreArchivo: finalName,
            urlArchivo: urlData.publicUrl,
            fechaDocumento,
            tipoDocumento,
            textoOcr: ocrTexts[i] || null,
          });
        }
      }

      setMessage({ type: "success", text: `¡${images.length > 1 ? images.length + " documentos guardados" : "Documento guardado"} exitosamente!` });
      setTimeout(() => {
        resetAll();
        if (tab === "celular") clearMobileImages();
        setNombreBase("");
      }, 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error al subir. Intente nuevamente." });
    } finally {
      setIsUploading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#ECF4FC] px-6 py-4 flex items-center gap-3 border-b border-blue-100">
        <IoScanOutline className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="text-sm font-bold text-[#0A1733]">Digitalizar Documento (IA y Móvil)</h3>
          <p className="text-[11px] text-slate-500">
            Sube archivos, usa la cámara web o tu celular. El sistema soporta múltiples páginas.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          {(["archivo", "camara", "celular"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); resetAll(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === t ? "bg-white text-[#0A1733] shadow-sm" : "text-slate-500 hover:text-[#0A1733]"
              }`}
            >
              {t === "archivo" && <><IoCloudUploadOutline className="w-4 h-4" /> PC</>}
              {t === "camara" && <><IoCameraOutline className="w-4 h-4" /> Webcam</>}
              {t === "celular" && <><IoPhonePortraitOutline className="w-4 h-4" /> Celular (QR)</>}
            </button>
          ))}
        </div>

        {/* ── Tab: Archivo ── */}
        {tab === "archivo" && (
          <div className="space-y-3">
            <input type="file" id="doc-upload" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
            <label htmlFor="doc-upload" className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${file ? "border-blue-300 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"}`}>
              {file?.type.startsWith("image/") ? <IoImageOutline className="w-6 h-6 text-blue-600 shrink-0" /> : <IoDocumentTextOutline className={`w-6 h-6 shrink-0 ${file ? "text-blue-600" : "text-slate-400"}`} />}
              <span className={`text-sm font-medium truncate ${file ? "text-blue-800" : "text-slate-500"}`}>
                {file ? file.name : "Seleccionar PDF o Imagen en esta PC…"}
              </span>
            </label>
            {preview && <img src={preview} alt="Vista previa" className="w-full object-contain max-h-48 rounded-xl border border-slate-200" />}
          </div>
        )}

        {/* ── Tab: Webcam ── */}
        {tab === "camara" && (
          <div className="space-y-3">
            {!capturedImage ? (
              <div className="relative rounded-xl overflow-hidden bg-black max-w-lg mx-auto">
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} onUserMedia={() => setCameraReady(true)} className="w-full rounded-xl" />
                {cameraReady && (
                  <button type="button" onClick={capturePc} className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-[#0A1733] px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#CA0000] hover:text-white transition-all">
                    <IoCameraOutline className="w-4 h-4" /> Capturar
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <img src={capturedImage} alt="Foto capturada" className="w-full object-contain max-h-48 rounded-xl border border-slate-200" />
                <button type="button" onClick={() => setCapturedImage(null)} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#CA0000] transition-colors">
                  <IoRefreshOutline className="w-4 h-4" /> Volver a capturar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Celular (QR) ── */}
        {tab === "celular" && (
          <div className="space-y-4">
            {mobileImages.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
                  <QRCodeSVG value={qrUrl} size={150} level="H" includeMargin={false} />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-bold text-[#0A1733] text-lg">Escanea con tu celular</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    1. Abre la cámara de tu teléfono.<br/>
                    2. Escanea este código QR.<br/>
                    3. Toma las fotos desde el navegador de tu celular.<br/>
                    <span className="font-semibold text-blue-600">Las fotos aparecerán aquí automáticamente en tiempo real.</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    {mobileImages.length} {mobileImages.length === 1 ? "foto recibida" : "fotos recibidas"}
                  </span>
                  <button type="button" onClick={clearMobileImages} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                    <IoTrashOutline className="w-4 h-4" /> Borrar todas
                  </button>
                </div>
                {/* Galería (Horizontal scroll) */}
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {mobileImages.map((img, idx) => (
                    <div key={idx} className="shrink-0 relative">
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">Pág {idx + 1}</span>
                      <img src={img} alt={`Pág ${idx+1}`} className="w-40 h-40 object-cover rounded-xl border-2 border-slate-200 shadow-sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── OCR ── */}
        {hasContent && (getImagesToProcess().length > 0) && (
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Inteligencia Artificial (OCR)
              </span>
              {ocrStatus !== "procesando" && (
                <button type="button" onClick={runOcr} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                  <IoScanOutline className="w-4 h-4" />
                  {ocrStatus === "listo" ? "Re-escanear todo" : "Escanear todo el texto"}
                </button>
              )}
            </div>

            {ocrStatus === "procesando" && (
              <div className="space-y-1.5">
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                </div>
                <p className="text-[11px] text-slate-500">Analizando imágenes con IA… {Math.round(ocrProgress)}%</p>
              </div>
            )}

            {ocrStatus === "listo" && ocrTexts.length > 0 && (
              <div className="space-y-2">
                {ocrTexts.map((txt, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">Pág {idx + 1}</span>
                    <textarea
                      value={txt}
                      onChange={(e) => {
                        const newTexts = [...ocrTexts];
                        newTexts[idx] = e.target.value;
                        setOcrTexts(newTexts);
                      }}
                      rows={3}
                      className="w-full text-[11px] text-slate-700 border border-slate-200 rounded-lg p-3 pr-16 resize-y focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono leading-relaxed bg-white"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {ocrStatus === "error" && <p className="text-xs text-red-600 font-medium">No se pudo extraer texto. Puedes continuar sin OCR.</p>}
          </div>
        )}

        {/* ── Metadatos + Submit ── */}
        {hasContent && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Nombre Base</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Análisis Clínico"
                  value={nombreBase}
                  onChange={(e) => setNombreBase(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0A1733] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Tipo</label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0A1733] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-white"
                >
                  <option value="historia_clinica">Historia Clínica</option>
                  <option value="resultado_laboratorio">Resultado de laboratorio</option>
                  <option value="imagen_diagnostica">Imagen diagnóstica (Rx, eco)</option>
                  <option value="receta">Receta médica</option>
                  <option value="consentimiento">Consentimiento informado</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Fecha Original</label>
                <input
                  type="date"
                  required
                  value={fechaDocumento}
                  onChange={(e) => setFechaDocumento(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0A1733] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all bg-[#CA0000] hover:bg-[#a80000] disabled:opacity-40 shadow-md flex items-center justify-center gap-2"
            >
              {isUploading ? "Subiendo a Supabase y procesando..." : <><IoCloudUploadOutline className="w-5 h-5"/> Digitalizar y Guardar Todo</>}
            </button>
          </form>
        )}

        {/* Mensaje */}
        {message.text && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.type === "success" ? <IoCheckmarkCircle className="w-5 h-5 shrink-0" /> : <IoCloseCircleOutline className="w-5 h-5 shrink-0" />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentScanner;
