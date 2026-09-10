import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, Loader2 } from 'lucide-react'
import { postInternship } from '../../features/industry/industrySlice'
import { pushToast } from '../../features/ui/uiSlice'

const skillOptions = ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express.js', 'Python', 'Java', 'Docker', 'Cloud (AWS)', 'System Design', 'SQL', 'REST APIs']

export default function PostInternship() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [posting, setPosting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: [], softSkills: [], eligibility: 'B.Tech/B.E.',
    branch: 'CS/IT', minCgpa: 6.5, location: '', remote: false, duration: '6 months',
    stipend: 20000, positions: 2, deadline: ''
  })

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  function toggleSkill(skill) {
    const skills = form.requiredSkills.includes(skill)
      ? form.requiredSkills.filter((s) => s !== skill)
      : [...form.requiredSkills, skill]
    update('requiredSkills', skills)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || form.requiredSkills.length === 0) {
      dispatch(pushToast('Please fill in all required fields.', 'error'))
      return
    }
    setPosting(true)
    const result = await dispatch(postInternship({ companyId: user.id, data: form }))
    setPosting(false)
    if (postInternship.fulfilled.match(result)) {
      dispatch(pushToast('Internship posted successfully!', 'success'))
      navigate('/industry/dashboard')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card bg-gradient-to-r from-teal-500 to-teal-600 text-white border-none flex items-center gap-3">
        <FilePlus2 size={24} />
        <div>
          <h2 className="text-lg font-bold">Post a New Internship</h2>
          <p className="text-slate-200 text-sm">Make it visible to thousands of qualified students.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 card">
        <div>
          <label className="label">Internship Title *</label>
          <input className="input" required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Frontend Developer Intern" />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input" rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What will interns do? What technologies?" />
        </div>

        <div>
          <label className="label">Required Skills *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {skillOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.requiredSkills.includes(s)} onChange={() => toggleSkill(s)} className="w-4 h-4 accent-teal-500" />
                <span className="text-sm text-slate-700">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Soft Skills (comma-separated)</label>
          <input className="input" value={form.softSkills.join(', ')} onChange={(e) => update('softSkills', e.target.value.split(',').map((s) => s.trim()))} placeholder="e.g. Communication, Teamwork" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Minimum CGPA</label>
            <input className="input" type="number" step="0.1" value={form.minCgpa} onChange={(e) => update('minCgpa', parseFloat(e.target.value))} />
          </div>
          <div>
            <label className="label">Eligible Year / Branch</label>
            <input className="input" value={form.branch} onChange={(e) => update('branch', e.target.value)} placeholder="e.g. CS/IT/ECE" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City or On-site" />
          </div>
          <div>
            <label className="label flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.remote} onChange={(e) => update('remote', e.target.checked)} className="w-4 h-4 accent-teal-500" />
              <span>Also remote</span>
            </label>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Duration</label>
            <input className="input" value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="e.g. 6 months" />
          </div>
          <div>
            <label className="label">Stipend (₹/month)</label>
            <input className="input" type="number" value={form.stipend} onChange={(e) => update('stipend', parseInt(e.target.value))} />
          </div>
          <div>
            <label className="label">Positions</label>
            <input className="input" type="number" value={form.positions} onChange={(e) => update('positions', parseInt(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="label">Application Deadline</label>
          <input className="input" type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/industry/dashboard')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={posting} className="btn-primary flex-1">
            {posting ? <Loader2 className="animate-spin" size={16} /> : 'Publish Internship'}
          </button>
        </div>
      </form>
    </div>
  )
}
