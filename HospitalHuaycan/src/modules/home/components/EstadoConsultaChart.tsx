import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Rectangle } from "recharts";
import { ConteoItem } from "../types";
import ChartCard from "./ChartCard";

interface EstadoConsultaChartProps {
  data: ConteoItem[];
  fechaLabel: string;
}

const ETAPA_INFO: Record<string, { label: string; color: string }> = {
  PENDIENTE:   { label: "Espera Triaje", color: "#86b6ef" },
  EN_TRIAJE:   { label: "En Triaje", color: "#5598e7" },
  EN_CONSULTA: { label: "Listo p/Consulta", color: "#2a78d6" },
  FINALIZADO:  { label: "Atendido", color: "#184f95" },
};

export default function EstadoConsultaChart({ data, fechaLabel }: EstadoConsultaChartProps) {
  const total = data.reduce((acc, d) => acc + d.total, 0);
  const chartData = data.map((d) => ({ ...d, label: ETAPA_INFO[d.etiqueta]?.label ?? d.etiqueta }));

  return (
    <ChartCard
      title={`Atenciones por etapa · ${fechaLabel}`}
      subtitle="Solo citas con atención iniciada"
      isEmpty={total === 0}
      emptyMessage="No hay atenciones iniciadas para esta fecha"
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 16, left: -18, bottom: 4 }}>
          <CartesianGrid horizontal vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, "Atenciones"]} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            barSize={36}
            shape={(props: any) => (
              <Rectangle {...props} fill={ETAPA_INFO[props.payload.etiqueta]?.color ?? "#94a3b8"} />
            )}
          >
            <LabelList dataKey="total" position="top" style={{ fontSize: 11, fill: "#0A1733", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
