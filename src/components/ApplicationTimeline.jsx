import { CheckCircle2, Circle } from 'lucide-react'

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']

export default function ApplicationTimeline({ status }) {
  const isRejected = status === 'Rejected'
  const currentIdx = STAGES.indexOf(status)

  if (isRejected) {
    return <span className="badge-red">Rejected</span>
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1">
      {STAGES.map((stage, i) => {
        const done = i <= currentIdx
        return (
          <div key={stage} className="flex items-center shrink-0">
            <div className={`flex items-center gap-1 text-xs ${done ? 'text-teal-600 font-medium' : 'text-slate-300'}`}>
              {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              <span className="whitespace-nowrap">{stage}</span>
            </div>
            {i < STAGES.length - 1 && <div className={`w-6 h-0.5 mx-1 ${i < currentIdx ? 'bg-teal-400' : 'bg-slate-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}
