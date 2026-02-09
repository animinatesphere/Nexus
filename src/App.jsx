
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'
import LoginOtp from './pages/auth/LoginOtp'
import AuthGuard from './components/auth/AuthGuard'
import { Toaster } from 'sonner'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Tasks from './pages/Tasks'
import KanbanBoardPage from './pages/KanbanBoardPage'
import TimeTracking from './pages/TimeTracking'
import Landing from './pages/Landing'
import Finance from './pages/Finance'
import Vault from './pages/Vault'
import BreakRoom from './pages/BreakRoom'
import Settings from './pages/Settings'
import AdminLayout from './components/layout/AdminLayout'
import AdminGuard from './components/auth/AdminGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import Upgrade from './pages/Upgrade'

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Auth Routes - Standalone for Cinematic Effect */}
        <Route path="/login" element={<LoginOtp />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        
        {/* Protected App Routes */}
        <Route element={
          <AuthGuard>
            {/* App Routes */}
            <AppLayout />
          </AuthGuard>
        }>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/kanban" element={<KanbanBoardPage />} />
          <Route path="/time-tracking" element={<TimeTracking />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/break-room" element={<BreakRoom />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upgrade" element={<Upgrade />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} /> {/* Reusing for demo */}
          <Route path="/admin/revenue" element={<AdminDashboard />} /> {/* Reusing for demo */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
