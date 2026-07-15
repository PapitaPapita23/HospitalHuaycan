import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

export default function ChartCard({ title, subtitle, isEmpty, emptyMessage, children }: ChartCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0A1733]">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {isEmpty ? (
        <div className="flex items-center justify-center h-40 text-xs text-slate-400 font-medium">
          {emptyMessage || "Sin datos por ahora"}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
