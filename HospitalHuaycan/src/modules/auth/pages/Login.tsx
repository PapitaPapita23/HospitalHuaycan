/// <reference types="vite/client" />
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import bgImage from "../assets/Login.png";

const Login: React.FC = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === "ROLE_ADMISION") navigate("/admision", { replace: true });
      else if (userRole === "ROLE_MEDICO") navigate("/medico", { replace: true });
      else if (userRole === "ROLE_ENFERMERIA") navigate("/triaje", { replace: true });
      else if (userRole === "ROLE_ARCHIVO") navigate("/archivo", { replace: true });
      else navigate("/home", { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-black/25">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-8 md:px-10 lg:px-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
            <div className="hidden lg:block text-left text-white">
              <h1 className="max-w-xl text-4xl font-bold uppercase leading-[1.05] tracking-tight lg:text-6xl">
                Historias clinicas hospitalarias
              </h1>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-auto">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 