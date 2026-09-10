import { useDispatch, useSelector } from 'react-redux'
import { Bell, Shield, Eye } from 'lucide-react'
import { pushToast } from '../features/ui/uiSlice'

export default function Settings() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  function handleToggle(setting) {
    dispatch(pushToast(`${setting} preference saved.`, 'success'))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-medium text-sm text-slate-800">Email Address</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button className="btn-outline text-xs">Change</button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="font-medium text-sm text-slate-800">Password</p>
              <p className="text-xs text-slate-500">••••••••</p>
            </div>
            <button className="btn-outline text-xs">Reset</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bell size={18} /> Notification Preferences
        </h3>
        <div className="space-y-3">
          {['Application Updates', 'Skill Recommendations', 'Job Alerts', 'Industry Collaboration Requests'].map((pref) => (
            <label key={pref} className="flex items-center gap-3 cursor-pointer py-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-500" />
              <span className="text-sm text-slate-700">{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Eye size={18} /> Privacy & Visibility
        </h3>
        <div className="space-y-3">
          {['Profile is public', 'Show in candidate search', 'Allow industry messages'].map((pref) => (
            <label key={pref} className="flex items-center gap-3 cursor-pointer py-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-500" onChange={() => handleToggle(pref)} />
              <span className="text-sm text-slate-700">{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Shield size={18} /> Danger Zone
        </h3>
        <div className="flex gap-2">
          <button className="btn-danger text-sm">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
