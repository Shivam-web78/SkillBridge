import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Sparkles, Save, Plus, X } from 'lucide-react'
import UploadBox from '../../components/UploadBox'
import ProgressBar from '../../components/ProgressBar'
import { fetchStudentProfile, updateStudentProfile, uploadResume } from '../../features/student/studentSlice'
import { pushToast } from '../../features/ui/uiSlice'

export default function StudentProfile() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { profile } = useSelector((s) => s.student)
  const [form, setForm] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => { if (user) dispatch(fetchStudentProfile(user.id)) }, [user, dispatch])
  useEffect(() => { if (profile) setForm(profile) }, [profile])

  if (!form) return null

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSave() {
    await dispatch(updateStudentProfile({ userId: user.id, updates: form }))
    dispatch(pushToast('Profile updated successfully.', 'success'))
  }

  async function handleResume(file) {
    setUploading(true)
    const result = await dispatch(uploadResume({ userId: user.id, fileName: file.name }))
    setUploading(false)
    if (uploadResume.fulfilled.match(result)) {
      dispatch(pushToast('Resume parsed! AI-extracted skills added to your profile.', 'success'))
      setForm((f) => ({
        ...f,
        technicalSkills: result.payload.technicalSkills,
        projects: [...(f.projects || []), ...result.payload.projects],
        certifications: [...(f.certifications || []), ...result.payload.certifications],
        resumeFileName: result.payload.resumeFileName
      }))
    }
  }

  function addSkill() {
    if (!newSkill.trim()) return
    update('technicalSkills', [...(form.technicalSkills || []), { name: newSkill.trim(), level: 40 }])
    setNewSkill('')
  }

  function removeSkill(name) {
    update('technicalSkills', form.technicalSkills.filter((s) => s.name !== name))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Resume Upload</h3>
        <UploadBox uploading={uploading} uploadedName={form.resumeFileName} onFile={handleResume} label="Upload your resume" />
        {form.resumeFileName && (
          <div className="mt-4 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-teal-700">
            <Sparkles size={16} /> AI extracted skills, projects and certifications have been merged into your profile below. Review and edit as needed.
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">College</label><input className="input" value={form.college || ''} onChange={(e) => update('college', e.target.value)} /></div>
          <div><label className="label">Degree</label><input className="input" value={form.degree || ''} onChange={(e) => update('degree', e.target.value)} /></div>
          <div><label className="label">Branch</label><input className="input" value={form.branch || ''} onChange={(e) => update('branch', e.target.value)} /></div>
          <div><label className="label">Year</label><input className="input" value={form.year || ''} onChange={(e) => update('year', e.target.value)} /></div>
          <div><label className="label">CGPA</label><input className="input" type="number" step="0.1" value={form.cgpa || ''} onChange={(e) => update('cgpa', e.target.value)} /></div>
          <div><label className="label">Location</label><input className="input" value={form.location || ''} onChange={(e) => update('location', e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} /></div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Technical Skills</h3>
        <div className="space-y-3">
          {(form.technicalSkills || []).map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="flex-1"><ProgressBar label={s.name} value={s.level} /></div>
              <button onClick={() => removeSkill(s.name)} className="text-slate-300 hover:text-danger-500"><X size={16} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input className="input" placeholder="Add a skill (e.g. Docker)" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
          <button onClick={addSkill} className="btn-outline shrink-0"><Plus size={16} /> Add</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Projects</h3>
        <div className="space-y-3">
          {(form.projects || []).map((p, i) => (
            <div key={i} className="border border-slate-100 rounded-lg p-3">
              <p className="font-medium text-sm text-slate-700">{p.title}</p>
              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              <div className="flex flex-wrap gap-1 mt-2">{(p.tech || []).map((t) => <span key={t} className="badge-slate">{t}</span>)}</div>
            </div>
          ))}
          {(!form.projects || form.projects.length === 0) && <p className="text-sm text-slate-400">No projects added yet — upload a resume or add manually.</p>}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-3">Certifications & Achievements</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {(form.certifications || []).map((c, i) => <span key={i} className="badge-blue">{c}</span>)}
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.achievements || []).map((a, i) => <span key={i} className="badge-green">{a}</span>)}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> Save Profile
      </button>
    </div>
  )
}
