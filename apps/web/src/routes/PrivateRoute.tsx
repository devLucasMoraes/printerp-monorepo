import { Navigate, Outlet } from 'react-router'

import { useAuthStore } from '../stores/auth-store'

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />
}

export default PrivateRoute
