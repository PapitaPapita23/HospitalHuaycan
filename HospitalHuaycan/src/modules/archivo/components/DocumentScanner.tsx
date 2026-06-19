import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  IoCloudUploadOutline,
  IoCameraOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoScanOutline,
  IoRefreshOutline,
  IoImageOutline,
} from "react-icons/io5";
import { supabase } from "../../../lib/supabase";
import { apiPost } from "../../../lib/apiClient";

interface Props {
  historiaClinicaId: number;
}

type Tab = "archivo" | "camara";
type OcrStatus = "idle" | "procesando" | "listo" | "error";

const DocumentScanner: React.FC<Props> = ({ historiaClinicaId }) => {
  const [tab, setTab] = useState<Tab>("archivo");

  // Archivo
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Cámara
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // OCR
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);

  // Upload
  const [fechaDocumento, setFechaDocumento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("historia_clinica");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ── Helpers ──────────────────────────────────────────────────────────────

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setCapturedImage(null);
    setOcrText("");
    setOcrStatus("idle");
    setOcrProgress(0);
    setMessage({ type: "", text: "" });
  };

  const currentImage = tab === "archivo" ? preview : capturedImage;
  const hasContent = tab === "archivo" ? !!file : !!capturedImage;

  // ── Archivo ───────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOcrText("");
    setOcrStatus("idle");
    setMessage({ type: "", text: "" });

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null); // PDF: sin preview de imagen
    }
  };

  // ── Cámara ────────────────────────────────────────────────────────────────

  const capture = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setCapturedImage(img);
      setOcrText("");
      setOcrStatus("idle");
    }
  }, []);

  const retakePhoto = () => {
    setCapturedImage(null);
    setOcrText("");
    setOcrStatus("idle");
  };

  // ── OCR ───────────────────────────────────────────────────────────────────

  const runOcr = async (imageSource: string) => {
    setOcrStatus("procesando");
    setOcrProgress(0);
    setOcrText("");

    try {
      // Simula progreso visual mientras espera la respuesta del backend
      const timer = setInterval(() => setOcrProgress((p) => Math.min(p + 10, 90)), 400);

      const res = await fetch("http://localhost:8080/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSource }),
      });

      clearInterval(timer);
      setOcrProgress(100);

      if (!res.ok) throw new Error("Error del servidor OCR");
      const data = await res.json();

      setOcrText(data.text ?? "");
      setOcrStatus("listo");
    } catch {
      setOcrStatus("error");
    }
  };

  const handleOcr = () => {
    const src = tab === "archivo" ? preview : capturedImage;
    if (src) runOcr(src);
  };

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!hasContent) {
      setMessage({ type: "error", text: "Seleccione un archivo o capture una imagen." });
      return;
    }
    if (!fechaDocumento) {
      setMessage({ type: "error", text: "Ingrese la fecha original del documento." });
      return;
    }

    try {
      setIsUploading(true);

      let uploadFile: File;
      let fileName: string;

      if (tab === "camara" && capturedImage) {
        // Convertir base64 a File
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        fileName = `${Date.now()}_HC${historiaClinicaId}_camara.jpg`;
        uploadFile = new File([blob], fileName, { type: "image/jpeg" });
      } else if (file) {
        fileName = `${Date.now()}_HC${historiaClinicaId}_${file.name.replace(/\s+/g, "_")}`;
        uploadFile = file;
      } else {
        return;
      }

      // 1. Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("historias_antiguas")
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("historias_antiguas")
        .getPublicUrl(uploadData.path);

      // 2. Backend — guarda metadatos + texto OCR
      await apiPost("/documentos-escaneados", {
        historiaClinicaId,
        nombreArchivo: fileName,
        urlArchivo: urlData.publicUrl,
        fechaDocumento,
        tipoDocumento,
        textoOcr: ocrText || null,
      });

      setMessage({ type: "success", text: "¡Documento digitalizado y vinculado correctamente!" });
      resetAll();
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
          <h3 className="text-sm font-bold text-[#0A1733]">Digitalizar Documento</h3>
          <p className="text-[11px] text-slate-500">
            Sube un archivo escaneado o captura con cámara. El OCR extrae el texto automáticamente.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          {(["archivo", "camara"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); resetAll(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === t
                  ? "bg-white text-[#0A1733] shadow-sm"
                  : "text-slate-500 hover:text-[#0A1733]"
              }`}
            >
              {t === "archivo" ? (
                <><IoCloudUploadOutline className="w-4 h-4" /> Subir archivo</>
              ) : (
                <><IoCameraOutline className="w-4 h-4" /> Usar cámara</>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Archivo ── */}
        {tab === "archivo" && (
          <div className="space-y-3">
            <input
              type="file"
              id="doc-upload"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="doc-upload"
              className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                file ? "border-blue-300 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
              }`}
            >
              {file?.type.startsWith("image/") ? (
                <IoImageOutline className="w-6 h-6 text-blue-600 shrink-0" />
              ) : (
                <IoDocumentTextOutline className={`w-6 h-6 shrink-0 ${file ? "text-blue-600" : "text-slate-400"}`} />
              )}
              <span className={`text-sm font-medium truncate ${file ? "text-blue-800" : "text-slate-500"}`}>
                {file ? file.name : "Haga clic para seleccionar PDF o imagen (JPG, PNG)…"}
              </span>
            </label>

            {preview && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64">
                <img src={preview} alt="Vista previa" className="w-full object-contain max-h-64" />
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Cámara ── */}
        {tab === "camara" && (
          <div className="space-y-3">
            {!capturedImage ? (
              <div className="relative rounded-xl overflow-hidden bg-black">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "environment" }}
                  onUserMedia={() => setCameraReady(true)}
                  onUserMediaError={() => setMessage({ type: "error", text: "No se pudo acceder a la cámara. Verifica los permisos." })}
                  className="w-full rounded-xl"
                />
                {cameraReady && (
                  <button
                    type="button"
                    onClick={capture}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2
                               bg-white text-[#0A1733] px-5 py-2.5 rounded-full font-bold text-sm shadow-lg
                               hover:bg-[#CA0000] hover:text-white transition-all"
                  >
                    <IoCameraOutline className="w-4 h-4" /> Capturar
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-64">
                  <img src={capturedImage} alt="Foto capturada" className="w-full object-contain max-h-64" />
                </div>
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#CA0000] transition-colors"
                >
                  <IoRefreshOutline className="w-4 h-4" /> Volver a capturar
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── OCR ── */}
        {hasContent && (currentImage || file?.type === "application/pdf") && (
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Reconocimiento de texto (OCR)
              </span>
              {currentImage && ocrStatus !== "procesando" && (
                <button
                  type="button"
                  onClick={handleOcr}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <IoScanOutline className="w-4 h-4" />
                  {ocrStatus === "listo" ? "Re-escanear" : "Escanear texto"}
                </button>
              )}
              {file?.type === "application/pdf" && (
                <span className="text-[11px] text-slate-400">No disponible para PDF</span>
              )}
            </div>

            {ocrStatus === "procesando" && (
              <div className="space-y-1.5">
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">Analizando imagen… {ocrProgress}%</p>
              </div>
            )}

            {ocrStatus === "listo" && (
              <textarea
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                rows={5}
                placeholder="Texto extraído del documento…"
                className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-3 resize-y
                           focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono leading-relaxed bg-white"
              />
            )}

            {ocrStatus === "error" && (
              <p className="text-xs text-red-600 font-medium">
                No se pudo extraer texto. Puedes continuar sin OCR.
              </p>
            )}

            {ocrStatus === "idle" && currentImage && (
              <p className="text-[11px] text-slate-400">
                Haz clic en «Escanear texto» para extraer el contenido del documento automáticamente.
              </p>
            )}
          </div>
        )}

        {/* ── Metadatos + Submit ── */}
        {hasContent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Tipo de documento
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium
                             text-[#0A1733] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none bg-white"
                >
                  <option value="historia_clinica">Historia Clínica</option>
                  <option value="resultado_laboratorio">Resultado de laboratorio</option>
                  <option value="imagen_diagnostica">Imagen diagnóstica (Rx, eco)</option>
                  <option value="receta">Receta médica</option>
                  <option value="consentimiento">Consentimiento informado</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="sm:w-48">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Fecha original
                </label>
                <input
                  type="date"
                  required
                  value={fechaDocumento}
                  onChange={(e) => setFechaDocumento(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium
                             text-[#0A1733] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !fechaDocumento}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-white transition-all
                         bg-[#CA0000] hover:bg-[#a80000] disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              {isUploading ? "Subiendo…" : "Digitalizar y vincular"}
            </button>
          </form>
        )}

        {/* Mensaje */}
        {message.text && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success"
              ? <IoCheckmarkCircle className="w-5 h-5 shrink-0" />
              : <IoCloseCircleOutline className="w-5 h-5 shrink-0" />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentScanner;
