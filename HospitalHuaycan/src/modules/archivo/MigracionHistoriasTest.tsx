import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { apiGet, apiPost } from "../../lib/apiClient";

export default function MigracionHistoriasTest() {
  // Estado para la Sección A (Subida)
  const [historiaClinicaId, setHistoriaClinicaId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });

  // Estado para la Sección B (Visualización)
  const [searchId, setSearchId] = useState("");
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Acción: Subir y Anexar (Sección A)
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadMessage({ type: "", text: "" });

    if (!historiaClinicaId) {
      setUploadMessage({ type: "error", text: "Ingrese el ID de la historia clínica." });
      return;
    }
    if (!file) {
      setUploadMessage({ type: "error", text: "Seleccione un archivo PDF." });
      return;
    }

    try {
      setIsUploading(true);

      // 1. Subir a Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
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
        historiaClinicaId: Number(historiaClinicaId),
        nombreArchivo: file.name,
        urlArchivo: publicUrl,
      });

      setUploadMessage({ type: "success", text: "¡Documento subido y anexado con éxito!" });
      setFile(null); // Limpiar input
      
      // Si estamos viendo la misma historia, recargar la lista
      if (searchId === historiaClinicaId) {
        handleSearch(e, historiaClinicaId);
      }

    } catch (error: any) {
      console.error(error);
      setUploadMessage({ type: "error", text: error.message || "Error al subir el archivo" });
    } finally {
      setIsUploading(false);
    }
  };

  // Acción: Buscar Documentos (Sección B)
  const handleSearch = async (e?: React.FormEvent, idToSearch?: string) => {
    if (e) e.preventDefault();
    const targetId = idToSearch || searchId;
    
    if (!targetId) {
      setFetchError("Ingrese un ID para buscar.");
      return;
    }

    try {
      setIsLoadingDocs(true);
      setFetchError("");
      const data = await apiGet<any[]>(`/documentos-escaneados/${targetId}`);
      setDocumentos(data);
    } catch (error: any) {
      console.error(error);
      setFetchError("Error al obtener los documentos.");
      setDocumentos([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Demostración: Migración de Historias Clínicas (HU08)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECCIÓN A: PERSONAL DE ARCHIVO */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Sección A: Personal de Archivo (Subida)
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID de Historia Clínica
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej. 1"
                value={historiaClinicaId}
                onChange={(e) => setHistoriaClinicaId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo Físico Escaneado (Mock PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-sm"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full text-white font-medium py-2 px-4 rounded ${
                isUploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Subiendo..." : "Subir y Anexar"}
            </button>

            {uploadMessage.text && (
              <div className={`p-3 rounded text-sm ${uploadMessage.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {uploadMessage.text}
              </div>
            )}
          </form>
        </div>


        {/* SECCIÓN B: MÉDICO */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-teal-700 mb-4">
            Sección B: Vista del Médico
          </h2>
          
          <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
            <input
              type="number"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Buscar por ID de Historia..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoadingDocs}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded"
            >
              {isLoadingDocs ? "Cargando..." : "Consultar"}
            </button>
          </form>

          {fetchError && (
            <div className="mb-4 p-3 rounded text-sm bg-red-100 text-red-700">
              {fetchError}
            </div>
          )}

          <div className="overflow-y-auto max-h-64 border rounded">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border-b">Archivo</th>
                  <th className="p-2 border-b">Fecha Subida</th>
                  <th className="p-2 border-b text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {documentos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No hay documentos para esta historia.
                    </td>
                  </tr>
                ) : (
                  documentos.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="p-2 border-b truncate max-w-[150px] font-medium text-gray-700" title={doc.nombreArchivo}>
                        📄 {doc.nombreArchivo}
                      </td>
                      <td className="p-2 border-b text-gray-500">
                        {new Date(doc.fechaSubida).toLocaleString()}
                      </td>
                      <td className="p-2 border-b text-center">
                        <a
                          href={doc.urlArchivo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline hover:text-blue-800 text-xs font-semibold"
                        >
                          Ver Documento
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
