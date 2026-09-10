import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, Plus } from 'lucide-react'
import { fetchFacultyOpportunities } from '../../features/admin/adminSlice'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import { pushToast } from '../../features/ui/uiSlice'

export default function Faculty() {
  const dispatch = useDispatch()
  const { facultyOpportunities } = useSelector((s) => s.admin)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', company: '', type: 'Research Collaboration', duration: '', description: '' })

  useEffect(() => { dispatch(fetchFacultyOpportunities()) }, [dispatch])

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title) return
    dispatch(pushToast('Faculty opportunity posted!', 'success'))
    setForm({ title: '', company: '', type: 'Research Collaboration', duration: '', description: '' })
    setShowAdd(false)
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen size={24} />
          <div>
            <h3 className="text-lg font-bold">Faculty & Academia</h3>
            <p className="text-slate-200 text-sm">Research collaborations, consultancy and academic partnerships</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn bg-white text-orange-600 hover:bg-slate-100 flex items-center gap-2 shrink-0">
          <Plus size={16} /> Post Opportunity
        </button>
      </div>

      {facultyOpportunities.length === 0 ? (
        <EmptyState icon={BookOpen} title="No faculty opportunities" />
      ) : (
        <div className="space-y-3">
          {facultyOpportunities.map((f) => (
            <div key={f.id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{f.title}</h4>
                  <p className="text-sm text-slate-500">{f.company}</p>
                  <p className="text-sm text-slate-700 mt-2">{f.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="badge-blue text-xs">{f.type}</span>
                    <span className="badge-slate text-xs">{f.duration}</span>
                  </div>
                </div>
                <button className="btn-outline text-sm shrink-0">View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Post Faculty Opportunity">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Partner Company</label>
            <input className="input" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option>Research Collaboration</option>
              <option>Consultancy Project</option>
              <option>Joint Publication</option>
              <option>Curriculum Design</option>
            </select>
          </div>
          <div>
            <label className="label">Duration</label>
            <input className="input" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 6 months" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows="3" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Post</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
