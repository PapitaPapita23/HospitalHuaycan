import { ConteoItem } from "../types";
import DistribucionDonut from "./DistribucionDonut";

interface TurnoDonutProps {
  data: ConteoItem[];
  fechaLabel: string;
}

// Paleta categórica validada (CVD-safe sobre superficie clara)
const TURNO_INFO = [
  { etiqueta: "MANANA", label: "Turno mañana", color: "#b8860b" },
  { etiqueta: "TARDE", label: "Turno tarde", color: "#2a78d6" },
];

export default function TurnoDonut({ data, fechaLabel }: TurnoDonutProps) {
  const donutData = TURNO_INFO.map((info) => ({
    label: info.label,
    value: data.find((d) => d.etiqueta === info.etiqueta)?.total ?? 0,
    color: info.color,
  }));

  return (
    <DistribucionDonut
      title={`Citas por turno · ${fechaLabel}`}
      subtitle="Distribución mañana / tarde"
      data={donutData}
      emptyMessage="No hay citas registradas para esta fecha"
      tooltipLabel="citas"
      centerLabel="citas"
    />
  );
}
