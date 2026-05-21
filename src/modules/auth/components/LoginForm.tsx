/// <reference types="vite/client" />
import React, { useState, useContext } from "react";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import { validateLogin, validatePasswordRecovery } from "./validationLogin";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import ministerioLogo from "../assets/ministerio-salud.png";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
    { email: false, password: false }
  );
  const [isRecovery, setIsRecovery] = useState<boolean>(false);
  const [recoverySent, setRecoverySent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("recovery: ", isRecovery);
    console.log("recovery sent: ", recoverySent);

    if (isRecovery) {
      setTouched({ email: true, password: false });
      const validationErrors = validatePasswordRecovery(email);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        setLoading(true);
        try {
          // Aquí iría la llamada a la API de recuperación de contraseña
          setTimeout(() => {
            setLoading(false);
            setRecoverySent(true);
          }, 1500);
        } catch (error) {
          console.error("Error en recuperación de contraseña:", error);
          setLoading(false);
        }
      }
      return;
    }

    setTouched({ email: true, password: true });
    const validationErrors = validateLogin(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await handleLogin(email, password);
        navigate("/home");
      } catch (error) {
        console.error("Error en login:", error);
        setErrors({
          email:
            "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-[430px] rounded-[20px] bg-white/80 px-9 py-10 shadow-2xl backdrop-blur-sm">
      <div className="mb-10 flex justify-center">
        <img src={ministerioLogo} alt="Ministerio de Salud" className="h-14 w-auto" />
      </div>

      {/* Inputs */}
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        {isRecovery ? (
          <>
            <div>
              <div className={`w-full mb-2 ${recoverySent ? "hidden" : ""}`}>
                <label
                  htmlFor="email"
                  className="text-[#0A1733] text-[16px] block"
                >
                  Correo electronico
                </label>
                <LoginInput
                  type="email"
                  placeholder=""
                  showToggle={false}
                  // @ts-ignore
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  autoFocus
                  autoComplete="username"
                />
                {touched.email && errors.email && (
                  <div id="email-error" className="text-red-400 text-xs mt-1">
                    {errors.email}
                  </div>
                )}
                <div className="w-full text-center mt-[25px]">
                  <a
                    href="#"
                    className="text-sm text-[#0A1733] hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRecovery(!isRecovery);
                    }}
                  >
                    Volver al login
                  </a>
                </div>
              </div>
              <div className={`${recoverySent ? "" : "hidden"}`}>
                <h1 className="text-[#0A1733] text-[16px] block mt-4 text-center">
                  Se envio un correo a {email}
                </h1>
                <div className="w-full text-center mt-[25px]">
                  <a
                    href="#"
                    className="text-sm text-[#0A1733] hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRecovery(!isRecovery);
                      setRecoverySent(!recoverySent);
                    }}
                  >
                    Volver al login
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full mb-2">
              <label
                htmlFor="email"
                className="text-[#0A1733] text-[16px] block"
              >
                Correo electronico
              </label>
              <LoginInput
                type="email"
                placeholder=""
                showToggle={false}
                // @ts-ignore
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                autoFocus
                autoComplete="username"
              />
              {touched.email && errors.email && (
                <div id="email-error" className="text-red-400 text-xs mt-1">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="w-full mb-2">
              <label
                htmlFor="password"
                className="text-[#0A1733] text-[16px] block mt-[25px]"
              >
                contraseña
              </label>
              <LoginInput
                type="password"
                placeholder=""
                showToggle
                // @ts-ignore
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                autoComplete="current-password"
              />
              {touched.password && errors.password && (
                <div id="password-error" className="text-red-400 text-xs mt-1">
                  {errors.password}
                </div>
              )}
            </div>
            {/* Recuperar contraseña */}
            <div className="w-full text-center mt-[25px]">
              <a
                href="#"
                className="text-sm text-[#0A1733] hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRecovery(!isRecovery);
                }}
              >
                Recuperar contraseña
              </a>
            </div>
          </>
        )}

        {/* Botón de inicio de sesión */}
        {!recoverySent && (
          <div className="w-full mt-[25px] flex flex-col items-center">
            <LoginButton>
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white mx-auto" />
              ) : isRecovery ? (
                "Enviar solicitud"
              ) : (
                "Iniciar sesion"
              )}
            </LoginButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
