import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Save, BadgeCheck } from 'lucide-react'
import { fetchIndustryProfile, updateIndustryProfile } from '../../features/industry/industrySlice'
import { pushToast } from '../../features/ui/uiSlice'

export default function CompanyProfile() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { profile } = useSelector((s) => s.industry)
  const [form, setForm] = useState(null)

  useEffect(() => { if (user) dispatch(fetchIndustryProfile(user.id)) }, [user, dispatch])
  useEffect(() => { if (profile) setForm(profile) }, [profile])

  if (!form) return null

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSave() {
    await dispatch(updateIndustryProfile({ userId: user.id, updates: form }))
    dispatch(pushToast('Company profile updated successfully.', 'success'))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">Company Information</h3>
            <p className="text-sm text-slate-500">Your public company profile visible to students and institutions.</p>
          </div>
          {profile.verified && (
            <span className="badge-green flex items-center gap-1">
              <BadgeCheck size={14} /> Verified
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Company Name</label>
            <input className="input" value={form.companyName || ''} onChange={(e) => update('companyName', e.target.value)} />
          </div>

          <div>
            <label className="label">Industry</label>
            <select className="input" value={form.industry || ''} onChange={(e) => update('industry', e.target.value)}>
              <option value="">Select Industry</option>
              <option value="Software Services">Software Services</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="FinTech">FinTech</option>
              <option value="CleanTech">CleanTech</option>
              <option value="Data & AI">Data & AI</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location (HQ)</label>
              <input className="input" value={form.location || ''} onChange={(e) => update('location', e.target.value)} />
            </div>
            <div>
              <label className="label">Company Size</label>
              <select className="input" value={form.size || ''} onChange={(e) => update('size', e.target.value)}>
                <option value="">Select Size</option>
                <option value="10-50">10-50</option>
                <option value="50-200">50-200</option>
                <option value="200-500">200-500</option>
                <option value="500-1000">500-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">About Company</label>
            <textarea className="input" rows="4" value={form.about || ''} onChange={(e) => update('about', e.target.value)} placeholder="Tell students and academia about your company..." />
          </div>
        </div>
      </div>

      {!profile.verified && (
        <div className="card border-l-4 border-orange-400 bg-orange-50">
          <h4 className="font-semibold text-orange-800">Pending Verification</h4>
          <p className="text-sm text-orange-700 mt-1">Your company is awaiting verification from the institution. This typically takes 1-2 business days.</p>
        </div>
      )}

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> Save Profile
      </button>
    </div>
  )
}
