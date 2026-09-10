import { MapPin, Clock, Wallet, Building2, Bookmark } from 'lucide-react'
import MatchScore from './MatchScore'

export default function OpportunityCard({ opp, type, onApply, onViewDetails, applied }) {
  return (
    <div className="card flex flex-col sm:flex-row gap-4 sm:items-center">
      {opp.matchPercent !== undefined && <MatchScore percent={opp.matchPercent} />}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-slate-800">{opp.title}</h4>
            <p className="text-sm text-slate-500 flex items-center gap-1"><Building2 size={13} /> {opp.company}</p>
          </div>
          {applied && <span className="badge-blue shrink-0">Applied</span>}
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}{opp.remote ? ' • Remote' : ''}</span>
          {opp.duration && <span className="flex items-center gap-1"><Clock size={12} /> {opp.duration}</span>}
          {(opp.stipend || opp.salary) && <span className="flex items-center gap-1"><Wallet size={12} /> {opp.stipend ? `₹${opp.stipend}/mo` : opp.salary}</span>}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(opp.requiredSkills || []).slice(0, 5).map((s) => (
            <span key={s} className="badge-slate">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
        <button className="btn-outline flex-1" onClick={() => onViewDetails(opp)}>Details</button>
        {!applied && (
          <button className="btn-primary flex-1" onClick={() => onApply(opp)}>Apply Now</button>
        )}
      </div>
    </div>
  )
}
