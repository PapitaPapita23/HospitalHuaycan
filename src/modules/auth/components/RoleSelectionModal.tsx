import React from "react";
import {
  FaUser,
  FaBook,
  FaGraduationCap,
  FaChevronRight,
} from "react-icons/fa";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: "teacher" | "student") => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onRoleSelect,
}) => {
  if (!isOpen) return null;

  const handleRoleSelect = (role: "teacher" | "student") => {
    onRoleSelect(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#0a1733]/90 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideIn border border-white/10">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#5F7EFF] to-[#2EE0A2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUser className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#D9D9D9] mb-3">
            Selecciona tu rol
          </h2>
          <p className="text-[#D9D9D9]/80 text-sm leading-relaxed">
            Elige el perfil con el que deseas ingresar
          </p>
        </div>

        {/* Role Options */}
        <div className="space-y-4 mb-8">
          {/* Teacher Option */}
          <button
            onClick={() => handleRoleSelect("teacher")}
            className="w-full p-6 border-2 border-white/20 rounded-2xl hover:border-[#5F7EFF] hover:bg-white/5 transition-all duration-300 group shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5F7EFF] to-[#2EE0A2] rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <FaBook className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-[#D9D9D9] text-lg mb-1 group-hover:text-[#5F7EFF] transition-colors">
                  Profesor
                </h3>
                <p className="text-sm text-[#D9D9D9]/70 leading-relaxed">
                  Acceso a herramientas de gestion academica
                </p>
              </div>
              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#5F7EFF] transition-colors">
                <FaChevronRight className="w-4 h-4 text-[#D9D9D9] group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>

          {/* Student Option */}
          <button
            onClick={() => handleRoleSelect("student")}
            className="w-full p-6 border-2 border-white/20 rounded-2xl hover:border-[#5F7EFF] hover:bg-white/5 transition-all duration-300 group shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5F7EFF] to-[#2EE0A2] rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <FaGraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-[#D9D9D9] text-lg mb-1 group-hover:text-[#5F7EFF] transition-colors">
                  Estudiante
                </h3>
                <p className="text-sm text-[#D9D9D9]/70 leading-relaxed">
                  Acceso a clases, tareas y recursos
                </p>
              </div>
              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#5F7EFF] transition-colors">
                <FaChevronRight className="w-4 h-4 text-[#D9D9D9] group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-[#D9D9D9] hover:text-[#5F7EFF] text-sm font-medium underline hover:no-underline transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
