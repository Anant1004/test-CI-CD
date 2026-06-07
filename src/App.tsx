
import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "@/pages/auth/login"
import { DashboardPage } from "@/pages/dashboard"
import { PatientsPage } from "@/pages/patients"
import { AddPatientPage } from "@/pages/patients/new"
import { PatientReportsPage } from "@/pages/patients/reports"
import { AppointmentsPage } from "@/pages/appointments"
import { SettingsPage } from "@/pages/settings"
import { RolesPage } from "@/pages/settings/roles"
import { CreateRolePage } from "@/pages/settings/roles/new"
import { MainLayout } from "@/components/layout/main-layout"

// Helper function to check permissions
const hasPermission = (pageId: string, action: 'view' | 'create' | 'edit' | 'delete') => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return false;

  const user = JSON.parse(userJson);
  if (user.role?.id === 'super-admin') return true;

  const permission = user.role?.permissions?.[pageId];
  return permission ? permission[action] : false;
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login "
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={
            hasPermission('dashboard', 'view') ? <DashboardPage /> : <Navigate to="/unauthorized" />
          } />

          <Route path="patients">
            <Route index element={
              hasPermission('patients', 'view') ? <PatientsPage /> : <Navigate to="/unauthorized" />
            } />
            <Route path="new" element={
              hasPermission('patients', 'create') ? <AddPatientPage /> : <Navigate to="/patients" />
            } />
            <Route path="reports" element={
              hasPermission('patients', 'view') ? <PatientReportsPage /> : <Navigate to="/patients" />
            } />
          </Route>

          <Route path="appointments" element={
            hasPermission('appointments', 'view') ? <AppointmentsPage /> : <Navigate to="/unauthorized" />
          } />

          <Route path="settings/roles">
            <Route index element={
              hasPermission('roles', 'view') ? <RolesPage /> : <Navigate to="/unauthorized" />
            } />
            <Route path="new" element={
              hasPermission('roles', 'create') ? <CreateRolePage /> : <Navigate to="/settings/roles" />
            } />
          </Route>

          <Route path="settings" element={
            hasPermission('settings', 'view') ? <SettingsPage /> : <Navigate to="/unauthorized" />
          } />
        </Route>

        <Route path="/unauthorized" element={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Unauthorized</h1>
            <p className="text-muted-foreground">You do not have permission to access this page.</p>
          </div>
        } />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
