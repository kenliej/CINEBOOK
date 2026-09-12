import '@/styles/global.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import type { ReactNode } from 'react'
import { Navbar } from '@/components/common/navbar'
import { Footer } from '@/components/common/footer'
import HomePage from '@/pages/home'
import FavoritesPage from '@/pages/favorites'
import TransactionsPage from '@/pages/transactions'
import NotificationsPage from '@/pages/notifications'
import ProfilePage from '@/pages/profile'
import SettingsPage from '@/pages/settings'
import MovieDetails from '@/pages/movie/index'
import AuthPage from '@/pages/auth'
import AdminPanel from './pages/admin'
import { isAdmin, isLoggedIn } from '@/lib/auth'

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function AdminOnlyRoute({ children }: { children: ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
      <Route path="/admin" element={<AdminOnlyRoute><AdminPanel /></AdminOnlyRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Footer />
  </BrowserRouter>
)