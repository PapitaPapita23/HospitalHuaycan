import { MedicamentoReceta } from "../types";

export interface PrintRecetaData {
  pacienteNombres: string;
  pacienteDni: string;
  citaId: number;
  diagnosticoPrincipalCodigo?: string;
  diagnosticoPrincipalDescripcion?: string;
  diagnosticosSecundarios?: string | string[];
  medicamentos: MedicamentoReceta[];
  tratamiento?: string;
  indicaciones?: string;
  fechaAtencion?: string;
}

const getCantidadEstimada = (frecuencia: string, dias: number): string => {
  const match = frecuencia.match(/\d+/);
  if (match) {
    const horas = parseInt(match[0], 10);
    if (horas > 0) {
      // e.g. 24 / 8 hours = 3 doses per day * days
      const tomasAlDia = 24 / horas;
      return `${Math.ceil(tomasAlDia * dias)} unds.`;
    }
  }
  // Standard frequency keywords translations
  const lower = frecuencia.toLowerCase();
  if (lower.includes("diario") || lower.includes("día") || lower.includes("dia") || lower.includes("24 h")) {
    return `${dias} unds.`;
  }
  return "C.N."; // Cantidad Necesaria
};

export const printReceta = (data: PrintRecetaData) => {
  const {
    pacienteNombres,
    pacienteDni,
    citaId,
    diagnosticoPrincipalCodigo,
    diagnosticoPrincipalDescripcion,
    diagnosticosSecundarios,
    medicamentos,
    tratamiento,
    indicaciones,
    fechaAtencion
  } = data;

  if (medicamentos.length === 0) {
    alert("Por favor agregue al menos un medicamento a la receta para poder imprimir.");
    return;
  }

  const nombreDoctor = localStorage.getItem("nombreCompleto") || "Médico Tratante";
  
  // Format attention date
  let fechaFormateada = "";
  if (fechaAtencion) {
    try {
      fechaFormateada = new Date(fechaAtencion).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      fechaFormateada = fechaAtencion;
    }
  } else {
    fechaFormateada = new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // Parse secondary diagnoses
  let secDiagnosesStr = "";
  if (diagnosticosSecundarios) {
    if (Array.isArray(diagnosticosSecundarios)) {
      secDiagnosesStr = diagnosticosSecundarios
        .map((d) => d.replace(/^\[.*?\]\s*/, ""))
        .join(", ");
    } else {
      secDiagnosesStr = diagnosticosSecundarios.replace(/^\[.*?\]\s*/, "");
    }
  }

  // Create iframe for printing if it doesn't exist
  let iframe = document.getElementById("print-recipe-iframe") as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "print-recipe-iframe";
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    alert("No se pudo iniciar el módulo de impresión.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Receta Médica - ${pacienteNombres}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          line-height: 1.5;
          font-size: 12px;
        }
        .recipe-container {
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 25px;
          position: relative;
        }
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0a1733;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .hospital-logo-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hospital-info h1 {
          margin: 0;
          font-size: 20px;
          color: #0a1733;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .hospital-info p {
          margin: 3px 0 0 0;
          font-size: 10px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .prescription-badge {
          background-color: #0a1733;
          color: white;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 20px;
          margin-bottom: 20px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
        }
        .info-item {
          display: flex;
          align-items: baseline;
        }
        .info-label {
          font-weight: 700;
          color: #64748b;
          width: 130px;
          flex-shrink: 0;
        }
        .info-value {
          color: #0f172a;
          font-weight: 600;
        }
        .section-title {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #0a1733;
          border-bottom: 1.5px solid #e2e8f0;
          padding-bottom: 4px;
          margin-bottom: 10px;
          margin-top: 20px;
          letter-spacing: 0.5px;
        }
        .med-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .med-table th {
          background-color: #f1f5f9;
          border-bottom: 2px solid #cbd5e1;
          color: #475569;
          text-align: left;
          padding: 8px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        .med-table td {
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 8px;
        }
        .med-name {
          font-weight: 750;
          color: #0f172a;
          font-size: 12px;
        }
        .med-desc {
          font-size: 10px;
          color: #64748b;
          margin-top: 1px;
          font-weight: 500;
        }
        .med-instructions {
          font-style: italic;
          color: #2563eb;
          font-size: 10px;
          margin-top: 2px;
        }
        .clinical-content {
          font-size: 11.5px;
          color: #334155;
          white-space: pre-wrap;
          background-color: #fff;
          border: 1px solid #f1f5f9;
          padding: 8px 12px;
          border-radius: 6px;
        }
        .footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .doctor-info p {
          margin: 3px 0;
        }
        .signature-area {
          text-align: center;
          width: 220px;
        }
        .signature-line {
          border-top: 1.5px dashed #94a3b8;
          margin-top: 50px;
          padding-top: 8px;
          font-weight: 700;
          color: #475569;
          font-size: 11px;
        }
        @media print {
          body {
            padding: 0;
          }
          .recipe-container {
            border: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="recipe-container">
        <div class="header-container">
          <div class="hospital-logo-title">
            <div class="hospital-info">
              <h1>HOSPITAL DE HUAYCÁN</h1>
              <p>Ministerio de Salud • R.D. N° 124-2022-SA</p>
            </div>
          </div>
          <div class="prescription-badge">
            Receta Médica Digital
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Paciente:</span>
            <span class="info-value">${pacienteNombres}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Fecha / Hora:</span>
            <span class="info-value">${fechaFormateada}</span>
          </div>
          <div class="info-item">
            <span class="info-label">DNI Paciente:</span>
            <span class="info-value">${pacienteDni}</span>
          </div>
          <div class="info-item">
            <span class="info-label">N° de Cita / Atención:</span>
            <span class="info-value">${citaId}</span>
          </div>
          <div class="info-item" style="grid-column: span 2;">
            <span class="info-label">Diagnóstico Principal:</span>
            <span class="info-value">${
              diagnosticoPrincipalCodigo
                ? `[${diagnosticoPrincipalCodigo}] ${diagnosticoPrincipalDescripcion || ""}`
                : "No especificado"
            }</span>
          </div>
          ${
            secDiagnosesStr
              ? `
            <div class="info-item" style="grid-column: span 2;">
              <span class="info-label">Diagnósticos Sec.:</span>
              <span class="info-value">${secDiagnosesStr}</span>
            </div>
          `
              : ""
          }
        </div>

        <div class="section-title">Prescripción de Medicamentos</div>
        <table class="med-table">
          <thead>
            <tr>
              <th style="width: 50%;">Medicamento / Presentación</th>
              <th style="width: 25%;">Dosis y Frecuencia</th>
              <th style="width: 15%;">Duración</th>
              <th style="width: 10%; text-align: right;">Cant.</th>
            </tr>
          </thead>
          <tbody>
            ${medicamentos
              .map(
                (med) => `
              <tr>
                <td>
                  <div class="med-name">${med.medicamento} ${
                  med.concentracion ? `(${med.concentracion})` : ""
                }</div>
                  <div class="med-desc">${med.forma_farmaceutica}</div>
                  ${
                    med.indicaciones_especiales
                      ? `<div class="med-instructions">Nota: ${med.indicaciones_especiales}</div>`
                      : ""
                  }
                </td>
                <td>${med.dosis} • ${med.frecuencia}</td>
                <td>${med.duracion_dias} días</td>
                <td style="font-weight: bold; text-align: right;">
                  ${getCantidadEstimada(med.frecuencia, med.duracion_dias)}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        ${
          indicaciones
            ? `
          <div class="section-title">Indicaciones Generales para el Paciente</div>
          <div class="clinical-content">${indicaciones}</div>
        `
            : ""
        }

        ${
          tratamiento
            ? `
          <div class="section-title">Tratamiento / Plan Clínico</div>
          <div class="clinical-content">${tratamiento}</div>
        `
            : ""
        }

        <div class="footer">
          <div class="doctor-info">
            <p><strong>Médico Tratante:</strong> ${nombreDoctor}</p>
            <p>Servicio de Consulta Médica</p>
            <p>Hospital de Huaycán</p>
          </div>
          <div class="signature-area">
            <div class="signature-line">
              Firma y Sello del Médico<br>
              C.M.P. N° ______________
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Print once contents are loaded
  setTimeout(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  }, 250);
};
