import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Share2, ExternalLink } from 'lucide-react'
import { fetchPortfolio } from '../../features/student/studentSlice'
import ProgressBar from '../../components/ProgressBar'
import VerificationBadge from '../../components/VerificationBadge'
import { pushToast } from '../../features/ui/uiSlice'

export default function Portfolio() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { portfolio } = useSelector((s) => s.student)

  useEffect(() => { if (user) dispatch(fetchPortfolio(user.id)) }, [user, dispatch])

  if (!portfolio) return null

  function handleShare() {
    const url = portfolio.portfolioUrl
    navigator.clipboard.writeText(url)
    dispatch(pushToast('Portfolio URL copied to clipboard!', 'success'))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card bg-gradient-to-r from-navy-900 to-navy-800 text-white border-none">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold">{portfolio.name}</h2>
            <p className="text-slate-300 text-sm mt-1">Verified Professional Portfolio</p>
          </div>
          <button onClick={handleShare} className="btn bg-white text-navy-900 hover:bg-slate-100 flex items-center gap-2">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {portfolio.assessment && (
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">Skill Assessment Score</h3>
          <div className="flex items-center gap-8">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white">
              <span className="text-3xl font-bold">{portfolio.assessment.overallScore}%</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-3">Breakdown:</p>
              {Object.entries(portfolio.assessment.breakdown).slice(0, 3).map(([k, v]) => (
                <ProgressBar key={k} label={k} value={v} showValue={false} height="h-1.5" />
              ))}
            </div>
          </div>
        </div>
      )}

      {portfolio.profile?.technicalSkills && (
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">Verified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {portfolio.profile.technicalSkills.map((s) => (
              <span key={s.name} className="badge-green flex items-center gap-1">
                {s.name} • {s.level}%
              </span>
            ))}
          </div>
        </div>
      )}

      {portfolio.certificates && portfolio.certificates.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">Certificates</h3>
          <div className="space-y-2">
            {portfolio.certificates.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-sm text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.issuer} • {c.issuedDate}</p>
                </div>
                <VerificationBadge verified={c.verified} />
              </div>
            ))}
          </div>
        </div>
      )}

      {portfolio.applications && portfolio.applications.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">Internship & Placement Experience</h3>
          <div className="space-y-2">
            {portfolio.applications.filter((a) => a.status === 'Selected').map((a) => (
              <div key={a.id} className="text-sm py-2 border-b border-slate-100 last:border-0">
                <p className="font-medium text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-500">{a.company}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card bg-slate-50 border-slate-200">
        <p className="text-xs text-slate-600 mb-2">Public Portfolio URL:</p>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-slate-700 flex-1 truncate">{portfolio.portfolioUrl}</code>
          <button onClick={handleShare} className="btn-outline text-xs">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
