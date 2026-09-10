import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Building2, Landmark, Sparkles, Loader2 } from 'lucide-react'
import { register, clearAuthError } from '../features/auth/authSlice'
import { pushToast } from '../features/ui/uiSlice'

const roles = [
  { key: 'student', label: 'Student', icon: GraduationCap },
  { key: 'industry', label: 'Industry', icon: Building2 },
  { key: 'admin', label: 'Administration', icon: Landmark }
]

export default function RegisterPage() {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [localError, setLocalError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    dispatch(clearAuthError())
    if (form.password.length < 6) return setLocalError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setLocalError('Passwords do not match.')

    const result = await dispatch(register({ name: form.name, email: form.email, password: form.password, role }))
    if (register.fulfilled.match(result)) {
      dispatch(pushToast('Account created! Welcome to SkillBridge.', 'success'))
      navigate(`/${role}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-teal-500 flex items-center justify-center text-white"><Sparkles size={18} /></div>
          <span className="font-bold text-lg text-white">SkillBridge</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-soft p-7">
          <h2 className="text-xl font-bold text-slate-800 text-center">Create your account</h2>
          <p className="text-sm text-slate-500 text-center mt-1">Join the academia-industry ecosystem</p>

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
              <label className="label">{role === 'industry' ? 'Company Name' : 'Full Name'}</label>
              <input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={role === 'industry' ? 'TechNova Solutions' : 'Your full name'} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="label">Confirm</label>
                <input className="input" type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            {(localError || error) && <p className="text-sm text-danger-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{localError || error}</p>}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3">
              {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account? <Link to="/login" className="text-teal-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
