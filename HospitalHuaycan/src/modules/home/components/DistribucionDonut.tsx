import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ChartCard from "./ChartCard";

export interface DonutItem {
  label: string;
  value: number;
  color: string;
}

interface DistribucionDonutProps {
  title: string;
  subtitle?: string;
  data: DonutItem[];
  emptyMessage: string;
  tooltipLabel: string;
  centerValue?: string;
  centerLabel?: string;
}

export default function DistribucionDonut({
  title,
  subtitle,
  data,
  emptyMessage,
  tooltipLabel,
  centerValue,
  centerLabel,
}: DistribucionDonutProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <ChartCard title={title} subtitle={subtitle} isEmpty={total === 0} emptyMessage={emptyMessage}>
      <div className="relative">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [`${value} ${tooltipLabel}`, name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black leading-none text-[#0A1733]">{centerValue ?? total}</p>
          {centerLabel && (
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {centerLabel}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="flex-1 truncate font-medium text-slate-500">{d.label}</span>
            <span className="font-bold text-[#0A1733]">{d.value}</span>
            <span className="w-10 text-right text-slate-400">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
