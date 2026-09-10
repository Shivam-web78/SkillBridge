import { useEffect, useState } from 'react'
import { HeartHandshake, Plus } from 'lucide-react'
import { apiGetCollaborations } from '../../services/mockApi'
import { pushToast } from '../../features/ui/uiSlice'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

export default function Collaboration() {
  const [collabs, setCollabs] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'Guest Lecture', description: '' })

  useEffect(() => {
    (async () => {
      const data = await apiGetCollaborations()
      setCollabs(data)
    })()
  }, [])

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title) return
    setCollabs([...collabs, { id: `col-${Date.now()}`, company: 'Your Company', ...form, status: 'open' }])
    pushToast('Collaboration posted!', 'success')
    setForm({ title: '', type: 'Guest Lecture', description: '' })
    setShowAdd(false)
  }

  const typeIcons = {
    'Guest Lecture': '🎤',
    'Live Project': '🚀',
    'Mentorship': '👥',
    'Innovation Challenge': '⚡',
    'Research Collaboration': '🔬',
    'Consultancy Project': '📊'
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HeartHandshake size={24} />
          <div>
            <h3 className="text-lg font-bold">Industry Collaborations</h3>
            <p className="text-slate-200 text-sm">Connect with academia and students on joint initiatives</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn bg-white text-purple-600 hover:bg-slate-100 flex items-center gap-2 shrink-0">
          <Plus size={16} /> New Collab
        </button>
      </div>

      {collabs.length === 0 ? (
        <EmptyState icon={HeartHandshake} title="No collaborations yet" description="Create guest lectures, live projects, or mentorship opportunities." />
      ) : (
        <div className="space-y-3">
          {collabs.map((c) => (
            <div key={c.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{typeIcons[c.type] || '📌'}</span>
                    <h4 className="font-semibold text-slate-800">{c.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{c.company}</p>
                  <p className="text-sm text-slate-600 mt-2">{c.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="badge-blue text-xs">{c.type}</span>
                    <span className="badge-green text-xs capitalize">{c.status}</span>
                  </div>
                </div>
                <button className="btn-outline text-sm shrink-0">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Post Collaboration">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Cloud Architecture Guest Lecture" />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option>Guest Lecture</option>
              <option>Live Project</option>
              <option>Mentorship</option>
              <option>Innovation Challenge</option>
              <option>Research Collaboration</option>
              <option>Consultancy Project</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows="4" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What are the details and requirements?" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Post Collaboration</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
