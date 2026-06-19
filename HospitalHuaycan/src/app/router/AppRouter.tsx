import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CalendarPage from "../pages/CalendarPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import SupportPage from "../pages/SupportPage";
import PlatformLayout from "../layout/PlatformLayout";
import Login from "../../modules/auth/pages/Login";
import RecoverPassword from "../../modules/auth/pages/RecoverPassword";

// Nuevos componentes de protección y páginas de roles
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import AdmisionDashboard from "../../modules/admision/AdmisionDashboard";
import MedicoPage from "../pages/MedicoPage";
import TriajePage from "../pages/TriajePage";
import ArchivoPage from "../pages/ArchivoPage";

import MigracionHistoriasTest from "../../modules/archivo/MigracionHistoriasTest";
import MobileCameraPage from "../pages/MobileCameraPage";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-clave" element={<RecoverPassword />} />
      <Route path="/mobile-upload/:sessionId" element={<MobileCameraPage />} />

      {/* Rutas Privadas Protegidas por Rol */}
      <Route element={<PlatformLayout />}>
        {/* Ruta General Home */}
        <Route path="/home" element={<HomePage />} />
        
        {/* Módulo de Admisión - Protegido por Rol */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMISION"]} />}>
          <Route path="/admision" element={<AdmisionDashboard />} />
        </Route>

        {/* Módulo de Médico - Protegido por Rol */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_MEDICO"]} />}>
          <Route path="/medico" element={<MedicoPage />} />
        </Route>

        {/* Módulo de Triaje/Enfermería - Protegido por Rol */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ENFERMERIA"]} />}>
          <Route path="/triaje" element={<TriajePage />} />
        </Route>

        {/* Módulo de Archivo Clínico - Protegido por Rol */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ARCHIVO"]} />}>
          <Route path="/archivo" element={<ArchivoPage />} />
        </Route>

        {/* Ruta de Prueba para la Demostración HU08 */}
        <Route path="/test-migracion" element={<MigracionHistoriasTest />} />

        {/* Rutas Comunes Adicionales */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
        
        {/* Página de No Autorizado */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* 404 - Ruta No Encontrada */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
