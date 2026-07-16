import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ConteoItem } from "../types";
import ChartCard from "./ChartCard";

interface EspecialidadBarChartProps {
  data: ConteoItem[];
  fechaLabel: string;
  title?: string;
  subtitle?: string;
}

const COLOR = "#2a78d6";

export default function EspecialidadBarChart({ data, fechaLabel, title, subtitle }: EspecialidadBarChartProps) {
  return (
    <ChartCard
      title={title ?? `Especialidades · ${fechaLabel}`}
      subtitle={subtitle ?? "Top 5 con más citas"}
      isEmpty={data.length === 0}
      emptyMessage="No hay citas registradas para esta fecha"
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 0, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="etiqueta"
            width={110}
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value: number) => [`${value}`, "Citas"]} cursor={{ fill: "#f1f5f9" }} />
          <Bar dataKey="total" fill={COLOR} radius={[0, 4, 4, 0]} barSize={18}>
            <LabelList dataKey="total" position="right" style={{ fontSize: 11, fill: "#0A1733", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
