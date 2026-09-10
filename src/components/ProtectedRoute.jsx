import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ role, children }) {
  const { user, token } = useSelector((s) => s.auth)
  const location = useLocation()

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/access-denied" replace />
  }

  return children
}
