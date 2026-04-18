import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { CLIENT_NAV_GROUPS } from '../config/dashboardNav.jsx'
import DashboardShell from './DashboardShell.jsx'

export default function ClientDashboardLayout() {
  const { isAuthenticated, user } = useAuth()
  const role = user?.role || 'client'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: 'client' }} />
  }
  if (role !== 'client') {
    return <Navigate to="/admin/overview" replace />
  }

  return (
    <DashboardShell navGroups={CLIENT_NAV_GROUPS} roleBadge="Client" />
  )
}
