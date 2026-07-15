import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ConteoPorFecha } from "../types";
import ChartCard from "./ChartCard";

interface TendenciaChartProps {
  data: ConteoPorFecha[];
  title: string;
  subtitle?: string;
  color: string;
  emptyMessage: string;
  tooltipLabel: string;
}

function formatFechaCorta(fecha: string) {
  const d = new Date(`${fecha}T00:00:00`);
  return d.toLocaleDateString("es-PE", { weekday: "short", day: "2-digit" }).replace(".", "");
}

export default function TendenciaChart({ data, title, subtitle, color, emptyMessage, tooltipLabel }: TendenciaChartProps) {
  const total = data.reduce((acc, d) => acc + d.total, 0);
  const chartData = data.map((d) => ({ ...d, fechaCorta: formatFechaCorta(d.fecha) }));

  return (
    <ChartCard title={title} subtitle={subtitle} isEmpty={total === 0} emptyMessage={emptyMessage}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 20, right: 16, left: -18, bottom: 4 }}>
          <CartesianGrid horizontal vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="fechaCorta" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, tooltipLabel]} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="total" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.12}>
            <LabelList
              dataKey="total"
              content={(props: any) => {
                const { x, y, index, value } = props;
                if (index !== chartData.length - 1) return null;
                return (
                  <text x={x} y={y - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0A1733">
                    {value}
                  </text>
                );
              }}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
