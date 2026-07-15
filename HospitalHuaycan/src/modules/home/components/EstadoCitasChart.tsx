import { ComponentType, CSSProperties } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Rectangle } from "recharts";
import { IoTimeOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import { ConteoItem } from "../types";
import ChartCard from "./ChartCard";

interface EstadoCitasChartProps {
  data: ConteoItem[];
  fechaLabel: string;
}

interface EstadoInfo {
  label: string;
  color: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
}

const ESTADO_INFO: Record<string, EstadoInfo> = {
  PENDIENTE:  { label: "Pendientes", color: "#fab219", icon: IoTimeOutline },
  ATENDIDO:   { label: "Atendidas", color: "#0ca30c", icon: IoCheckmarkCircleOutline },
  CANCELADO:  { label: "Canceladas", color: "#d03b3b", icon: IoCloseCircleOutline },
  NO_ASISTIO: { label: "No asistió", color: "#ec835a", icon: IoAlertCircleOutline },
};

export default function EstadoCitasChart({ data, fechaLabel }: EstadoCitasChartProps) {
  const total = data.reduce((acc, d) => acc + d.total, 0);

  return (
    <ChartCard title={`Citas por estado · ${fechaLabel}`} isEmpty={total === 0} emptyMessage="No hay citas registradas para esta fecha">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {data.map((item) => {
          const info = ESTADO_INFO[item.etiqueta];
          if (!info) return null;
          const Icon = info.icon;
          return (
            <div key={item.etiqueta} className="flex items-center gap-2 bg-slate-50 rounded-xl px-2.5 py-2">
              <Icon className="w-4 h-4 shrink-0" style={{ color: info.color }} />
              <div className="min-w-0">
                <p className="text-sm font-black text-[#0A1733] leading-none">{item.total}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate">{info.label}</p>
              </div>
            </div>
          );
        })}
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 0, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="etiqueta"
            width={90}
            tick={{ fontSize: 11, fill: "#475569" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: string) => ESTADO_INFO[value]?.label ?? value}
          />
          <Tooltip
            formatter={(value: number, _name: string, item: any) => [`${value}`, ESTADO_INFO[item.payload.etiqueta]?.label ?? ""]}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar
            dataKey="total"
            radius={[0, 4, 4, 0]}
            barSize={16}
            shape={(props: any) => (
              <Rectangle {...props} fill={ESTADO_INFO[props.payload.etiqueta]?.color ?? "#94a3b8"} />
            )}
          >
            <LabelList dataKey="total" position="right" style={{ fontSize: 11, fill: "#0A1733", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
