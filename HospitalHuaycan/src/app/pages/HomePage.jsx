import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer,
} from "recharts";
import {
  IoCalendarOutline, IoPersonOutline, IoMedicalOutline,
  IoPrintOutline, IoChevronDownOutline, IoChevronBackOutline, IoChevronForwardOutline,
} from "react-icons/io5";

// ─── Month Picker ─────────────────────────────────────────────────────────────
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MESES_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function MonthPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(value.year);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (month) => { onChange({ year, month }); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => { setYear(value.year); setOpen(o => !o); }}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
      >
        <IoCalendarOutline className="h-4 w-4 text-slate-400" />
        {MESES_FULL[value.month]} de {value.year}
        <IoChevronDownOutline className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
          {/* Año */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setYear(y => y - 1)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <IoChevronBackOutline className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-black text-[#0A1733]">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <IoChevronForwardOutline className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          {/* Grid meses */}
          <div className="grid grid-cols-4 gap-1.5">
            {MESES.map((m, i) => {
              const isActive = i === value.month && year === value.year;
              return (
                <button
                  key={m}
                  onClick={() => select(i)}
                  className={`py-2 rounded-xl text-[11px] font-bold transition-all
                    ${isActive
                      ? "bg-[#CA0000] text-white shadow-md shadow-[#CA0000]/30"
                      : "text-slate-500 hover:bg-slate-100"}`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Datos mock ───────────────────────────────────────────────────────────────
const attendanceData = [
  { dia: "1", v: 12 }, { dia: "2", v: 15 }, { dia: "3", v: 11 },
  { dia: "4", v: 18 }, { dia: "5", v: 14 }, { dia: "6", v: 20 },
  { dia: "7", v: 17 }, { dia: "8", v: 23 }, { dia: "9", v: 19 },
  { dia: "10", v: 22 }, { dia: "11", v: 25 }, { dia: "12", v: 21 },
  { dia: "13", v: 28 }, { dia: "14", v: 26 }, { dia: "15", v: 30 },
  { dia: "16", v: 29 }, { dia: "17", v: 27 }, { dia: "18", v: 32 },
  { dia: "19", v: 31 }, { dia: "20", v: 35 },
];

const citasData = [
  { name: "Atendidos", value: 75 },
  { name: "Pendientes", value: 25 },
];

const specialtyData = [
  { name: "Medicina General", value: 120 },
  { name: "Pediatría",        value: 80  },
  { name: "Ginecología",      value: 30  },
  { name: "Oncología",        value: 19  },
];

const sisData = [
  { name: "Activa",      value: 55, color: "#6B1A1A" },
  { name: "Inactiva",    value: 28, color: "#CA0000"  },
  { name: "Particular",  value: 17, color: "#F5C0C0"  },
];

const diagnosticsData = [
  { name: "Jair",      value: 42 },
  { name: "Arifael",   value: 38 },
  { name: "Katherine", value: 32 },
  { name: "Emey",      value: 25 },
  { name: "Tamara",    value: 20 },
];

const waitingPatients = [
  { nombre: "Jose",   dni: "72414756", especialidad: "Urología",     triaje: 5, medico: "Rodriguez V."  },
  { nombre: "Eduard", dni: "75369832", especialidad: "Dermatología", triaje: 5, medico: "Ramirez L."    },
  { nombre: "Mateo",  dni: "87965325", especialidad: "Oncología",    triaje: 5, medico: "De la cruz A." },
  { nombre: "Jair",   dni: "75412369", especialidad: "Dermatología", triaje: 5, medico: "Guzman G."     },
  { nombre: "Sebas",  dni: "85264578", especialidad: "Dermatología", triaje: 5, medico: "Quispe A."     },
  { nombre: "Ever",   dni: "75324814", especialidad: "Dermatología", triaje: 5, medico: "Huaman K."     },
  { nombre: "Emely",  dni: "78965432", especialidad: "Dermatología", triaje: 5, medico: "Castro L."     },
];

const TOOLTIP_STYLE = {
  borderRadius: "8px", border: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, delta, positive, iconBg, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm">
      <div className={`shrink-0 w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-md ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
          {title}
        </p>
        <p className="text-[2.6rem] font-black text-[#0A1733] leading-none mt-0.5">{value}</p>
        <p className={`text-[10px] font-semibold mt-1 ${positive ? "text-emerald-500" : "text-[#CA0000]"}`}>
          {positive ? "▲" : "▼"} {delta}
        </p>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const nombreCompleto = localStorage.getItem("nombreCompleto") || "Usuario";
  const primerNombre   = nombreCompleto.split(" ")[0].toUpperCase();
  const now = new Date();
  const [period, setPeriod] = useState({ year: now.getFullYear(), month: now.getMonth() });

  return (
    <div className="space-y-4">

      {/* ── Selector de mes ── */}
      <div className="flex justify-end">
        <MonthPicker value={period} onChange={setPeriod} />
      </div>

      {/* ── Fila 1: Saludo + Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Saludo */}
        <div className="p-2 flex flex-col justify-center">
          <h1 className="text-[1.6rem] font-black text-[#0A1733] leading-tight">
            HOLA {primerNombre}!
          </h1>
          <p className="text-sm font-bold text-[#0A1733] mt-0.5">UN GUSTO VERTE POR AQUÍ</p>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Esperamos que aproveches al máximo todos los recursos disponibles para
            optimizar la gestión de reportes. En tu panel de control encontrarás
            estadísticas en tiempo real sobre la actividad en la plataforma.
          </p>
        </div>

        <StatCard
          title="Citas Programadas Hoy"
          value={83}
          delta="+2 desde el mes anterior"
          positive
          iconBg="bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200"
          icon={<IoCalendarOutline className="w-9 h-9 text-white drop-shadow" />}
        />
        <StatCard
          title="Pacientes en Espera"
          value={71}
          delta="+4 desde el mes anterior"
          positive
          iconBg="bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-200"
          icon={<IoPersonOutline className="w-9 h-9 text-white drop-shadow" />}
        />
        <StatCard
          title="Pacientes Atendidos"
          value={12}
          delta="-2 desde el mes anterior"
          positive={false}
          iconBg="bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-200"
          icon={<IoMedicalOutline className="w-9 h-9 text-white drop-shadow" />}
        />
      </div>

      {/* ── Fila 2: Gráficos ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Área — Volumen diario */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-[#0A1733]">Volumen de Atenciones Diarias</p>
            <button className="flex items-center gap-1.5 text-[11px] text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
              <IoPrintOutline className="w-3.5 h-3.5" />
              Export PDF
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#CA0000" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#CA0000" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, "Atenciones"]} />
              <Area
                type="monotone" dataKey="v"
                stroke="#CA0000" strokeWidth={2}
                fill="url(#areaGrad)"
                dot={false} activeDot={{ r: 4, fill: "#CA0000" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut — Estado citas */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
          <p className="text-sm font-bold text-[#0A1733] mb-2">Estado de las Citas de Hoy</p>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={citasData} innerRadius={48} outerRadius={72}
                  startAngle={90} endAngle={-270} dataKey="value" paddingAngle={3}
                >
                  <Cell fill="#CA0000" />
                  <Cell fill="#F5C0C0" />
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            {/* Etiqueta central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-[#CA0000]">75%</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            {citasData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? "#CA0000" : "#F5C0C0" }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Barras horizontales — Especialidades */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-[#0A1733] mb-4">Pacientes por Especialidad</p>
          <div className="space-y-3.5">
            {specialtyData.map(({ name, value }) => (
              <div key={name}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 truncate pr-2">{name}</span>
                  <span className="font-bold text-[#0A1733] shrink-0">{value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CA0000] rounded-full transition-all duration-500"
                    style={{ width: `${(value / 120) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fila 3: Bottom ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Donut — SIS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-[#0A1733] mb-2">Estado de Cobertura SIS</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={sisData} innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3}>
                {sisData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {sisData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Barras — Top 5 diagnósticos */}
        <div className="bg-[#FFF5F5] rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-[#0A1733] mb-1 text-center">
            Top 5 Diagnósticos Frecuentes
          </p>
          <p className="text-[10px] text-slate-400 text-center mb-3">(CIE-10)</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={diagnosticsData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(202,0,0,0.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" fill="#CA0000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla — Próximos pacientes */}
        <div className="xl:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <p className="text-sm font-bold text-[#0A1733]">Próximos Pacientes en Espera</p>
          </div>
          <div className="overflow-auto max-h-[220px]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Paciente", "DNI", "Especialidad", "Estado Triaje", "Médico asignado"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[#CA0000] font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {waitingPatients.map((p, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#0A1733]">{p.nombre}</td>
                    <td className="px-4 py-3 text-slate-500">{p.dni}</td>
                    <td className="px-4 py-3 text-slate-500">{p.especialidad}</td>
                    <td className="px-4 py-3">
                      <span className="bg-[#CA0000]/10 text-[#CA0000] font-bold px-2 py-0.5 rounded-md">
                        {p.triaje}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.medico}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
