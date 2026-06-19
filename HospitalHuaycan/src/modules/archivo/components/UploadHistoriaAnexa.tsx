import React, { useState } from "react";
import { IoCloudUploadOutline, IoDocumentTextOutline, IoCheckmarkCircle } from "react-icons/io5";
import { supabase } from "../../../lib/supabase";
import { apiPost } from "../../../lib/apiClient";

interface Props {
  historiaClinicaId: number;
}

const UploadHistoriaAnexa: React.FC<Props> = ({ historiaClinicaId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fechaDocumento, setFechaDocumento] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadMessage({ type: "", text: "" }); // Reset message when new file selected
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadMessage({ type: "", text: "" });

    if (!file) {
      setUploadMessage({ type: "error", text: "Seleccione un archivo PDF." });
      return;
    }
    
    if (!fechaDocumento) {
      setUploadMessage({ type: "error", text: "Seleccione la fecha original del documento." });
      return;
    }

    try {
      setIsUploading(true);

      // 1. Subir a Supabase Storage
      const fileName = `${Date.now()}_HC${historiaClinicaId}_${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("historias_antiguas")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from("historias_antiguas")
        .getPublicUrl(uploadData.path);

      const publicUrl = publicUrlData.publicUrl;

      // 3. Guardar en Backend Spring Boot
      await apiPost("/documentos-escaneados", {
        historiaClinicaId: historiaClinicaId,
        nombreArchivo: file.name,
        urlArchivo: publicUrl,
        fechaDocumento: fechaDocumento,
      });

      setUploadMessage({ type: "success", text: "¡Documento físico anexado correctamente a esta Historia Clínica!" });
      setFile(null);
      setFechaDocumento("");
      // Opcional: reset file input using a ref, but re-rendering null file is okay.

    } catch (error: any) {
      console.error(error);
      setUploadMessage({ type: "error", text: error.message || "Error al subir el archivo. Intente nuevamente." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="bg-[#ECF4FC] px-6 py-4 flex items-center gap-3 border-b border-blue-100">
        <IoCloudUploadOutline className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="text-sm font-bold text-[#0A1733]">Anexar Historia Clínica Antigua</h3>
          <p className="text-[11px] text-slate-500">Digitaliza y vincula expedientes físicos al paciente actual.</p>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Seleccionar Archivo Escaneado (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                    file ? "border-blue-300 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
                  }`}
                >
                  <IoDocumentTextOutline className={`w-6 h-6 ${file ? "text-blue-600" : "text-slate-400"}`} />
                  <span className={`text-sm font-medium truncate ${file ? "text-blue-800" : "text-slate-500"}`}>
                    {file ? file.name : "Haga clic aquí para buscar el archivo PDF..."}
                  </span>
                </label>
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Fecha Original
              </label>
              <input
                type="date"
                required
                value={fechaDocumento}
                onChange={(e) => setFechaDocumento(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-[#0A1733] focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={isUploading || !file || !fechaDocumento}
              className={`px-8 py-3 h-[52px] rounded-xl text-sm font-bold text-white transition-all whitespace-nowrap ${
                isUploading || !file || !fechaDocumento
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isUploading ? "Subiendo..." : "Subir y Anexar"}
            </button>
          </div>
        </form>

        {uploadMessage.text && (
          <div className={`mt-4 flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
            uploadMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {uploadMessage.type === "success" ? <IoCheckmarkCircle className="w-5 h-5" /> : null}
            {uploadMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadHistoriaAnexa;
