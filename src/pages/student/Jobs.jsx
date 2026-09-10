import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Sliders } from 'lucide-react'
import { fetchJobs, fetchApplications, applyToOpportunity } from '../../features/student/studentSlice'
import { pushToast } from '../../features/ui/uiSlice'
import OpportunityCard from '../../components/OpportunityCard'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'

export default function StudentJobs() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { jobs, applications } = useSelector((s) => s.student)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOpp, setSelectedOpp] = useState(null)

  useEffect(() => {
    dispatch(fetchJobs({ search, location }))
    if (user) dispatch(fetchApplications(user.id))
  }, [search, location, dispatch, user])

  function handleApply(opp) {
    dispatch(applyToOpportunity({ userId: user.id, type: 'job', refId: opp.id }))
      .then((result) => {
        if (applyToOpportunity.fulfilled.match(result)) {
          dispatch(pushToast(`Applied to ${opp.title}!`, 'success'))
          setSelectedOpp(null)
        } else {
          dispatch(pushToast(result.payload || 'Could not apply.', 'error'))
        }
      })
  }

  const applied = new Set(applications.filter((a) => a.type === 'job').map((a) => a.refId))
  const withMatch = jobs.map((j) => ({ ...j, applied: applied.has(j.id) }))

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center justify-center gap-2">
          <Sliders size={16} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="card">
          <label className="label">Location</label>
          <select className="input" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All Locations</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
            <option value="Gurugram">Gurugram</option>
          </select>
        </div>
      )}

      {withMatch.length === 0 ? (
        <EmptyState title="No jobs found" description="Try adjusting your filters or search terms." />
      ) : (
        <div className="space-y-3">
          {withMatch.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              type="job"
              applied={opp.applied}
              onApply={() => setSelectedOpp(opp)}
              onViewDetails={() => setSelectedOpp(opp)}
            />
          ))}
        </div>
      )}

      <Modal open={!!selectedOpp} onClose={() => setSelectedOpp(null)} title={selectedOpp?.title}>
        {selectedOpp && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Company</p>
              <p className="font-semibold text-slate-800">{selectedOpp.company}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Description</p>
              <p className="text-sm text-slate-700">{selectedOpp.description}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-500">Salary</p><p className="font-medium">{selectedOpp.salary}</p></div>
              <div><p className="text-xs text-slate-500">Type</p><p className="font-medium">{selectedOpp.jobType}</p></div>
              <div><p className="text-xs text-slate-500">Experience</p><p className="font-medium">{selectedOpp.experience}</p></div>
              <div><p className="text-xs text-slate-500">Deadline</p><p className="font-medium">{selectedOpp.deadline}</p></div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {selectedOpp.requiredSkills.map((s) => <span key={s} className="badge-slate">{s}</span>)}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button onClick={() => setSelectedOpp(null)} className="btn-outline flex-1">Close</button>
              {!applied.has(selectedOpp.id) && (
                <button onClick={() => handleApply(selectedOpp)} className="btn-primary flex-1">Apply Now</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
