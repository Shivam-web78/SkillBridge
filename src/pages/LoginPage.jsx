import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Building2, Landmark, Sparkles, Loader2 } from 'lucide-react'
import { login, demoLogin, clearAuthError } from '../features/auth/authSlice'
import { pushToast } from '../features/ui/uiSlice'

const roles = [
  { key: 'student', label: 'Student', icon: GraduationCap },
  { key: 'industry', label: 'Industry', icon: Building2 },
  { key: 'admin', label: 'Administration', icon: Landmark }
]

export default function LoginPage() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch(clearAuthError())
    const result = await dispatch(login({ email, password, role }))
    if (login.fulfilled.match(result)) {
      dispatch(pushToast(`Welcome back, ${result.payload.user.name.split(' ')[0]}!`, 'success'))
      navigate(`/${role}/dashboard`)
    }
  }

  async function handleDemo(demoRole) {
    dispatch(clearAuthError())
    const result = await dispatch(demoLogin(demoRole))
    if (demoLogin.fulfilled.match(result)) {
      dispatch(pushToast(`Logged in as demo ${demoRole}.`, 'success'))
      navigate(`/${demoRole}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-teal-500 flex items-center justify-center text-white"><Sparkles size={18} /></div>
          <span className="font-bold text-lg text-white">SkillBridge</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-soft p-7">
          <h2 className="text-xl font-bold text-slate-800 text-center">Welcome back</h2>
          <p className="text-sm text-slate-500 text-center mt-1">Sign in to continue to your dashboard</p>

          <div className="grid grid-cols-3 gap-2 mt-6">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors ${
                  role === r.key ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <r.icon size={20} />
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-600 hover:underline">Forgot password?</Link>
              </div>
              <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && <p className="text-sm text-danger-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3">
              {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 'Log In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-400">OR TRY A DEMO ACCOUNT</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button onClick={() => handleDemo('student')} className="btn-outline text-xs py-2.5">Login as Student</button>
            <button onClick={() => handleDemo('industry')} className="btn-outline text-xs py-2.5">Login as Industry</button>
            <button onClick={() => handleDemo('admin')} className="btn-outline text-xs py-2.5">Login as Admin</button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            New here? <Link to="/register" className="text-teal-600 font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
