import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShieldAlert, SearchX } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white p-6 text-center">
      <SearchX size={48} className="text-teal-400 mb-4" />
      <h1 className="text-3xl font-bold">404 — Page Not Found</h1>
      <p className="text-slate-400 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  )
}

export function AccessDeniedPage() {
  const { user } = useSelector((s) => s.auth)
  const redirect = user ? `/${user.role}/dashboard` : '/login'
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-white p-6 text-center">
      <ShieldAlert size={48} className="text-danger-400 mb-4" />
      <h1 className="text-3xl font-bold">Access Denied</h1>
      <p className="text-slate-400 mt-2 max-w-sm">You don't have permission to view this page with your current role.</p>
      <Link to={redirect} className="btn-primary mt-6">Go to My Dashboard</Link>
    </div>
  )
}
