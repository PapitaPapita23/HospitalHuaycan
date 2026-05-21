import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import CalendarPage from '../pages/CalendarPage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import SupportPage from '../pages/SupportPage'
import PlatformLayout from '../layout/PlatformLayout'
import Login from '../../modules/auth/pages/Login'
import RecoverPassword from '../../modules/auth/pages/RecoverPassword'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-clave" element={<RecoverPassword />} />
      <Route element={<PlatformLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
