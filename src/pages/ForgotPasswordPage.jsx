import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { resetPassword, clearAuthError } from '../features/auth/authSlice'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [done, setDone] = useState(false)
  const dispatch = useDispatch()
  const { status, error } = useSelector((s) => s.auth)

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch(clearAuthError())
    const result = await dispatch(resetPassword({ email, newPassword }))
    if (resetPassword.fulfilled.match(result)) setDone(true)
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-teal-500 flex items-center justify-center text-white"><Sparkles size={18} /></div>
          <span className="font-bold text-lg text-white">SkillBridge</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-soft p-7">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 className="mx-auto text-teal-500 mb-3" size={36} />
              <h2 className="text-lg font-bold text-slate-800">Password reset</h2>
              <p className="text-sm text-slate-500 mt-1">You can now log in with your new password.</p>
              <Link to="/login" className="btn-primary mt-5 inline-flex">Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 text-center">Reset your password</h2>
              <p className="text-sm text-slate-500 text-center mt-1">Enter your account email and a new password.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input className="input" type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                </div>
                {error && <p className="text-sm text-danger-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3">
                  {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 'Reset Password'}
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-6">
                <Link to="/login" className="text-teal-600 font-medium hover:underline">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
