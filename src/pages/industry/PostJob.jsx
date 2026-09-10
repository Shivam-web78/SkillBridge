import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Loader2 } from 'lucide-react'
import { postJob } from '../../features/industry/industrySlice'
import { pushToast } from '../../features/ui/uiSlice'

const skillOptions = ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express.js', 'Python', 'Java', 'Docker', 'Cloud (AWS)', 'System Design', 'SQL', 'REST APIs', 'TypeScript']

export default function PostJob() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [posting, setPosting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: [], qualifications: 'B.Tech in CS/IT',
    experience: '0-2 years', salary: '6-9 LPA', location: '', jobType: 'Full-time', deadline: ''
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
    const result = await dispatch(postJob({ companyId: user.id, data: form }))
    setPosting(false)
    if (postJob.fulfilled.match(result)) {
      dispatch(pushToast('Job posted successfully!', 'success'))
      navigate('/industry/dashboard')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none flex items-center gap-3">
        <Briefcase size={24} />
        <div>
          <h2 className="text-lg font-bold">Post a New Job</h2>
          <p className="text-slate-200 text-sm">Attract top talent to your company.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 card">
        <div>
          <label className="label">Job Title *</label>
          <input className="input" required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Senior Backend Engineer" />
        </div>

        <div>
          <label className="label">Job Description</label>
          <textarea className="input" rows="4" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What are the responsibilities? What's the team like?" />
        </div>

        <div>
          <label className="label">Required Skills *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {skillOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.requiredSkills.includes(s)} onChange={() => toggleSkill(s)} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm text-slate-700">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Qualifications</label>
            <input className="input" value={form.qualifications} onChange={(e) => update('qualifications', e.target.value)} />
          </div>
          <div>
            <label className="label">Experience Required</label>
            <input className="input" value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="e.g. 2-4 years" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Salary (LPA)</label>
            <input className="input" value={form.salary} onChange={(e) => update('salary', e.target.value)} placeholder="e.g. 10-15" />
          </div>
          <div>
            <label className="label">Job Type</label>
            <select className="input" value={form.jobType} onChange={(e) => update('jobType', e.target.value)}>
              <option>Full-time</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <input className="input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City" />
        </div>

        <div>
          <label className="label">Application Deadline</label>
          <input className="input" type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/industry/dashboard')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={posting} className="btn-primary flex-1">
            {posting ? <Loader2 className="animate-spin" size={16} /> : 'Publish Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
