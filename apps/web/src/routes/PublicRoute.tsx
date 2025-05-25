import { Navigate, Outlet } from 'react-router'

import { useAuthStore } from '../stores/auth-store'

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore()

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />
}

export default PublicRoute
