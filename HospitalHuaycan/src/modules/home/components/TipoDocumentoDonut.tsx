import DistribucionDonut from "./DistribucionDonut";

// Datos referenciales (aún no existe agregación por tipo en el backend).
// Paleta categórica de 5 validada (CVD-safe, orden fijo).
const TIPOS_REFERENCIALES = [
  { label: "Historia clínica", value: 46, color: "#2a78d6" },
  { label: "Resultado de laboratorio", value: 24, color: "#1a8f66" },
  { label: "Imagen diagnóstica", value: 12, color: "#7c5cd6" },
  { label: "Receta médica", value: 10, color: "#b8860b" },
  { label: "Otros", value: 8, color: "#b3548f" },
];

export default function TipoDocumentoDonut() {
  return (
    <DistribucionDonut
      title="Documentos por tipo"
      subtitle="Distribución referencial del archivo (%)"
      data={TIPOS_REFERENCIALES}
      emptyMessage="Sin documentos registrados"
      tooltipLabel="%"
      centerValue="100%"
      centerLabel="del archivo"
    />
  );
}
