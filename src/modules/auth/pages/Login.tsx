import React from "react";
import LoginForm from "../components/LoginForm";
import bgImage from "../assets/Login.png";

const Login: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-black/25">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-8 md:px-10 lg:px-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
            <div className="text-left text-white">
              <h1 className="max-w-xl text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
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