interface CitasHoyHeroCardProps {
  total: number;
  mañana: number;
  tarde: number;
  fechaLabel: string;
}

export default function CitasHoyHeroCard({ total, mañana, tarde, fechaLabel }: CitasHoyHeroCardProps) {
  const progreso = total > 0 ? Math.round((mañana / total) * 100) : 0;

  return (
    <div className="bg-[#0A1733] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/[0.04]" />
      <div className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-[#CA0000]/25" />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 z-10">
        Total citas · {fechaLabel}
      </p>
      <div className="z-10">
        <p className="text-[3.5rem] font-black text-white leading-none">{total}</p>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-white/40 font-semibold mb-1.5">
            <span>Mañana · {mañana}</span>
            <span>Tarde · {tarde}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/50 rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
