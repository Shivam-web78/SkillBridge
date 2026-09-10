import { useState } from 'react'
import { GraduationCap, Plus } from 'lucide-react'
import { pushToast } from '../../features/ui/uiSlice'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

export default function IndustryLearningPrograms() {
  const [programs, setPrograms] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'Training', duration: '', description: '' })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title) return
    setPrograms([...programs, { id: `prog-${Date.now()}`, ...form }])
    pushToast('Program added!', 'success')
    setForm({ title: '', type: 'Training', duration: '', description: '' })
    setShowAdd(false)
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-teal-500 to-teal-600 text-white border-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <GraduationCap size={24} />
          <div>
            <h3 className="text-lg font-bold">Learning Programs</h3>
            <p className="text-slate-200 text-sm">Training, certification and bootcamp programs</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn bg-white text-teal-600 hover:bg-slate-100 flex items-center gap-2 shrink-0">
          <Plus size={16} /> Add Program
        </button>
      </div>

      {programs.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No programs yet" description="Create training, certification or bootcamp programs." />
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{p.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{p.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="badge-blue text-xs">{p.type}</span>
                    <span className="badge-slate text-xs">{p.duration}</span>
                  </div>
                </div>
                <button className="btn-outline text-sm shrink-0">Manage</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Program">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Program Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Cloud Engineering Bootcamp" />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option>Training</option>
              <option>Certification</option>
              <option>Workshop</option>
              <option>Bootcamp</option>
              <option>Mentorship</option>
            </select>
          </div>
          <div>
            <label className="label">Duration</label>
            <input className="input" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 4 weeks" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows="3" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What will students learn?" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create Program</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
