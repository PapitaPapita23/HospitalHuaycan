import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { IoShieldOutline } from "react-icons/io5";

const UnauthorizedPage: React.FC = () => {
  const { userRole, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (userRole === "ROLE_ADMISION") navigate("/admision");
    else if (userRole === "ROLE_MEDICO") navigate("/medico");
    else if (userRole === "ROLE_ENFERMERIA") navigate("/triaje");
    else if (userRole === "ROLE_ARCHIVO") navigate("/archivo");
    else navigate("/login");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-rose-50 border-2 border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <IoShieldOutline className="w-12 h-12" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-[#0A1733] tracking-tight mb-2">
        Acceso Restringido
      </h2>
      <p className="text-slate-500 max-w-md mb-8 text-base">
        Tu cuenta no cuenta con los permisos o el rol requerido para visualizar este módulo. Por favor, contacta al administrador del sistema si crees que esto es un error.
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleGoBack}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Volver a mi Panel
        </button>
        <button
          onClick={() => {
            handleLogout();
            navigate("/login");
          }}
          className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-sm transition-all cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
