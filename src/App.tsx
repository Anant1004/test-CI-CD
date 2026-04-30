import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "@/pages/auth/login"
import { DashboardPage } from "@/pages/dashboard"
import { PatientsPage } from "@/pages/patients"
import { AddPatientPage } from "@/pages/patients/new"
import { PatientReportsPage } from "@/pages/patients/reports"
import { AppointmentsPage } from "@/pages/appointments"
import { SettingsPage } from "@/pages/settings"
import { MainLayout } from "@/components/layout/main-layout"

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true'
    }
    return false
  })

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardPage />} />
          
          {/* Patients Module */}
          <Route path="patients">
            <Route index element={<PatientsPage />} />
            <Route path="new" element={<AddPatientPage />} />
            <Route path="reports" element={<PatientReportsPage />} />
          </Route>

          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
