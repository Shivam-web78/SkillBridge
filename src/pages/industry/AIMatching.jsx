import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Sparkles, ChevronDown } from 'lucide-react'
import { fetchCompanyOpportunities, fetchCandidates, shortlistCandidateDirect } from '../../features/industry/industrySlice'
import { pushToast } from '../../features/ui/uiSlice'
import MatchScore from '../../components/MatchScore'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'

export default function AIMatching() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { internships, jobs, candidatesByOpp } = useSelector((s) => s.industry)
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [oppType, setOppType] = useState('internship')
  const [loading, setLoading] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  useEffect(() => { if (user) dispatch(fetchCompanyOpportunities(user.id)) }, [user, dispatch])

  const opportunities = oppType === 'internship' ? internships : jobs

  async function handleSelectOpp(opp) {
    setSelectedOpp(opp)
    setLoading(true)
    await dispatch(fetchCandidates({ oppId: opp.id, type: oppType }))
    setLoading(false)
  }

  const candidates = selectedOpp ? (candidatesByOpp[`${oppType}-${selectedOpp.id}`] || []) : []
  const ranked = [...candidates].sort((a, b) => b.matchPercent - a.matchPercent)

  async function handleShortlist(candidate) {
    await dispatch(shortlistCandidateDirect({ companyId: user.id, studentId: candidate.studentId, oppId: selectedOpp.id, type: oppType }))
    dispatch(pushToast(`${candidate.name} shortlisted!`, 'success'))
    setSelectedCandidate(null)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none flex items-center gap-3">
        <Sparkles size={24} />
        <div>
          <h2 className="text-lg font-bold">AI Candidate Matching</h2>
          <p className="text-slate-200 text-sm">Find the best skill-matched candidates for each role.</p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <label className="label">Select Position</label>
          <div className="flex gap-2 mb-4">
            {['internship', 'job'].map((t) => (
              <button
                key={t}
                onClick={() => { setOppType(t); setSelectedOpp(null) }}
                className={`badge cursor-pointer capitalize ${oppType === t ? 'badge-green' : 'badge-slate'}`}
              >
                {t === 'internship' ? 'Internships' : 'Jobs'}
              </button>
            ))}
          </div>
        </div>

        <select
          className="input"
          value={selectedOpp?.id || ''}
          onChange={(e) => {
            const opp = opportunities.find((o) => o.id === e.target.value)
            if (opp) handleSelectOpp(opp)
          }}
        >
          <option value="">Choose a position to see AI-ranked candidates…</option>
          {opportunities.map((o) => (
            <option key={o.id} value={o.id}>{o.title} — {o.location}{o.remote ? ' (Remote)' : ''}</option>
          ))}
        </select>
      </div>

      {selectedOpp && (
        <div className="space-y-4">
          <div className="card bg-slate-50 border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Showing candidates for</p>
            <p className="font-semibold text-slate-800">{selectedOpp.title}</p>
            <p className="text-xs text-slate-500 mt-1">{ranked.length} candidates ranked by skill match</p>
          </div>

          {loading ? (
            <p className="text-center text-slate-400 py-8">Ranking candidates…</p>
          ) : ranked.length === 0 ? (
            <EmptyState title="No candidates yet" description="Wait for students to apply to this position." />
          ) : (
            <div className="space-y-3">
              {ranked.map((candidate, idx) => (
                <div key={candidate.studentId} className="card flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="h-7 w-7 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <div>
                        <h4 className="font-semibold text-slate-800">{candidate.name}</h4>
                        <p className="text-xs text-slate-500">{candidate.college} • {candidate.branch}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.matched.map((s) => (
                        <span key={s.name} className="badge-green text-xs flex items-center gap-1">
                          {s.name} ✓
                        </span>
                      ))}
                      {candidate.missing.slice(0, 2).map((s) => (
                        <span key={s.name} className="badge-orange text-xs">{s.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-3 items-center sm:items-end">
                    <MatchScore percent={candidate.matchPercent} size={56} />
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedCandidate(candidate)} className="btn-outline text-xs py-2">View</button>
                      <button onClick={() => handleShortlist(candidate)} className="btn-primary text-xs py-2">Shortlist</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title={selectedCandidate?.name}>
        {selectedCandidate && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Match Score</p>
              <p className="text-2xl font-bold text-teal-600">{selectedCandidate.matchPercent}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Matched Skills</p>
              <div className="flex flex-wrap gap-1">
                {selectedCandidate.matched.map((s) => (
                  <span key={s.name} className="badge-green text-xs">{s.name} ({s.level}%)</span>
                ))}
              </div>
            </div>
            {selectedCandidate.missing.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Skills to Develop</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCandidate.missing.map((s) => (
                    <span key={s.name} className="badge-orange text-xs">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
              <p className="font-medium mb-1">Why this match?</p>
              <p>Strong skills alignment and eligibility criteria match.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedCandidate(null)} className="btn-outline flex-1">Close</button>
              <button onClick={() => handleShortlist(selectedCandidate)} className="btn-primary flex-1">Shortlist</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
