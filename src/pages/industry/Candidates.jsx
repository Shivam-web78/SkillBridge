import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users, Search } from 'lucide-react'
import { fetchCompanyApplications } from '../../features/industry/industrySlice'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import ProgressBar from '../../components/ProgressBar'

export default function Candidates() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { applications } = useSelector((s) => s.industry)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  useEffect(() => { if (user) dispatch(fetchCompanyApplications(user.id)) }, [user, dispatch])

  const filtered = applications
    .filter((a) => statusFilter === 'all' || a.status === statusFilter)
    .filter((a) => !search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.college?.toLowerCase().includes(search.toLowerCase()))

  const statusOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users size={24} />
          <div>
            <h3 className="text-lg font-bold">Candidate Pool</h3>
            <p className="text-slate-200 text-sm">Review and screen applications</p>
          </div>
        </div>
        <span className="text-2xl font-bold">{applications.length}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search by name or college…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s === 'All' ? 'all' : s)}
            className={`badge text-xs font-medium cursor-pointer ${statusFilter === (s === 'All' ? 'all' : s) ? 'badge-green' : 'badge-slate'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No candidates found" description="Applications will appear here." />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedCandidate(app)}
              className="card text-left hover:shadow-md transition-shadow cursor-pointer w-full"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{app.studentName}</h4>
                  <p className="text-sm text-slate-500">{app.college}</p>
                  <p className="text-xs text-slate-400 mt-1">{app.title}</p>
                </div>
                <div className="text-right">
                  <span className={`badge text-xs ${
                    app.status === 'Shortlisted' ? 'badge-green' :
                    app.status === 'Under Review' ? 'badge-orange' :
                    app.status === 'Interview' ? 'badge-blue' :
                    app.status === 'Selected' ? 'badge-green' :
                    app.status === 'Rejected' ? 'badge-red' : 'badge-slate'
                  }`}>{app.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title={selectedCandidate?.studentName}>
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">College</p>
                <p className="font-medium text-slate-800">{selectedCandidate.college}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Position Applied</p>
                <p className="font-medium text-slate-800">{selectedCandidate.title}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Application Status</p>
              <select className="input" defaultValue={selectedCandidate.status}>
                <option>Applied</option>
                <option>Under Review</option>
                <option>Shortlisted</option>
                <option>Interview</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedCandidate(null)} className="btn-outline flex-1">Close</button>
              <button className="btn-primary flex-1">Send Message</button>
              <button className="btn-primary flex-1">Schedule Interview</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
