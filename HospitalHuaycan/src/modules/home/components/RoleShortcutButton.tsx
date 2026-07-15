import { ComponentType, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

interface RoleShortcutButtonProps {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
}

export default function RoleShortcutButton({ to, label, icon: Icon }: RoleShortcutButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 bg-[#0A1733] hover:bg-[#132449] active:scale-95 text-white text-sm font-bold rounded-xl transition-all duration-150 shadow-sm"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
