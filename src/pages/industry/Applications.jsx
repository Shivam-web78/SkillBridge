import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileCheck2, Loader2 } from 'lucide-react'
import { fetchCompanyApplications, updateApplicationStatus } from '../../features/industry/industrySlice'
import { pushToast } from '../../features/ui/uiSlice'
import ApplicationTimeline from '../../components/ApplicationTimeline'
import EmptyState from '../../components/EmptyState'

const STATUS_OPTIONS = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

export default function IndustryApplications() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { applications } = useSelector((s) => s.industry)
  const [updating, setUpdating] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { if (user) dispatch(fetchCompanyApplications(user.id)) }, [user, dispatch])

  const filtered = statusFilter === 'all' ? applications : applications.filter((a) => a.status === statusFilter)

  async function handleStatusChange(appId, newStatus) {
    setUpdating(appId)
    const result = await dispatch(updateApplicationStatus({ applicationId: appId, status: newStatus }))
    setUpdating(null)
    if (updateApplicationStatus.fulfilled.match(result)) {
      dispatch(pushToast('Application status updated.', 'success'))
    }
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none flex items-center gap-3">
        <FileCheck2 size={24} />
        <div>
          <h3 className="text-lg font-bold">Applications</h3>
          <p className="text-slate-200 text-sm">Track and manage all applications</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`badge text-xs font-medium cursor-pointer capitalize ${statusFilter === s ? 'badge-green' : 'badge-slate'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No applications" description={statusFilter === 'all' ? 'Applications will appear when students apply.' : `No ${statusFilter.toLowerCase()} applications.`} />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{app.studentName}</h4>
                  <p className="text-sm text-slate-500">{app.title} at {app.college}</p>
                  <p className="text-xs text-slate-400 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <ApplicationTimeline status={app.status} />
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={updating === app.id}
                    className="input text-xs py-2"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
