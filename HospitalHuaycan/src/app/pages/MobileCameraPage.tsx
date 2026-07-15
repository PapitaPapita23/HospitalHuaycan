import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { IoCameraOutline, IoCheckmarkCircleOutline, IoRefreshOutline, IoAddCircleOutline, IoPaperPlaneOutline } from "react-icons/io5";
import { BASE_URL } from "../../../lib/apiClient";

const MobileCameraPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [done, setDone] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_DIMENSION = 1920; // Resolución Full HD

        // Mantener proporción si la imagen es gigante
        if (width > height && width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Exportar a JPEG con 70% de calidad (Excelente legibilidad, peso ínfimo)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setPhoto(compressedBase64);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const sendPhoto = async () => {
    if (!photo) return;
    setIsSending(true);
    
    try {
      const res = await fetch(`${BASE_URL}/mobile-sync/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo })
      });

      if (!res.ok) throw new Error("Error al enviar");
      
      setPageCount(prev => prev + 1);
      setPhoto(null);
    } catch (error) {
      alert("Hubo un error al enviar la foto. Intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFinish = () => {
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <IoCheckmarkCircleOutline className="w-24 h-24 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Completado!</h2>
        <p className="text-slate-600">
          Se enviaron {pageCount} páginas a la computadora exitosamente. Ya puedes cerrar esta ventana y continuar en la PC.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-900 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <IoCameraOutline className="text-blue-400 w-6 h-6" /> Escáner Móvil
        </h1>
        <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-bold">
          {pageCount} páginas enviadas
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!photo ? (
          <div className="space-y-8 w-full max-w-sm text-center">
            <IoCameraOutline className="w-32 h-32 mx-auto text-slate-700" />
            <p className="text-slate-400">
              Alinea el documento con buena luz y presiona el botón para tomar una foto clara.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-900/50"
            >
              <IoCameraOutline className="w-7 h-7" /> Tomar Foto
            </button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={fileInputRef}
              onChange={handleCapture}
            />
            
            {pageCount > 0 && (
              <button
                onClick={handleFinish}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 mt-4 transition-colors"
              >
                <IoCheckmarkCircleOutline className="w-6 h-6" /> Finalizar y Cerrar
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col h-full">
            <h2 className="text-center font-bold text-slate-300 mb-4">Vista Previa</h2>
            <div className="flex-1 w-full bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700 shadow-2xl">
              <img src={photo} alt="Captura" className="max-h-full max-w-full object-contain" />
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={sendPhoto}
                disabled={isSending}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSending ? "Enviando..." : <><IoPaperPlaneOutline className="w-6 h-6" /> Guardar Página {pageCount + 1}</>}
              </button>
              <button
                onClick={() => setPhoto(null)}
                disabled={isSending}
                className="w-full bg-slate-800 text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700"
              >
                <IoRefreshOutline className="w-5 h-5" /> Volver a tomar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCameraPage;
