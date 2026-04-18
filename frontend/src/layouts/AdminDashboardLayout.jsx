import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { ADMIN_NAV_GROUPS } from '../config/dashboardNav.jsx'
import DashboardShell from './DashboardShell.jsx'

export default function AdminDashboardLayout() {
  const { isAuthenticated, user } = useAuth()
  const role = user?.role || 'client'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: 'admin' }} />
  }
  if (role !== 'admin') {
    return <Navigate to="/client/overview" replace />
  }

  return (
    <DashboardShell navGroups={ADMIN_NAV_GROUPS} roleBadge="Admin" />
  )
}
