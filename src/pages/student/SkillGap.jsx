import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fetchSkillGap } from '../../features/student/studentSlice'
import EmptyState from '../../components/EmptyState'

export default function SkillGap() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { skillGap } = useSelector((s) => s.student)

  useEffect(() => { if (user) dispatch(fetchSkillGap(user.id)) }, [user, dispatch])

  const topGaps = [...skillGap].sort((a, b) => b.gap - a.gap).filter((g) => g.gap > 0).slice(0, 3)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-1">Current Skills vs Industry Required Skills</h3>
        <p className="text-sm text-slate-400 mb-5">Based on your profile and current job-market skill requirements.</p>

        {skillGap.length === 0 ? (
          <EmptyState title="No skill data yet" description="Complete your profile or take the skill assessment to see your gap analysis." />
        ) : (
          <div className="space-y-5">
            {skillGap.map((g) => (
              <div key={g.skill}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{g.skill}</span>
                  <span className="text-xs text-slate-400">You: {g.student}% • Required: {g.required}%</span>
                </div>
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute h-3 bg-teal-500 rounded-full" style={{ width: `${g.student}%` }} />
                  <div className="absolute h-3 border-r-2 border-navy-800" style={{ width: `${g.required}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {topGaps.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">You should improve these skills</h3>
          <ol className="space-y-3">
            {topGaps.map((g, i) => (
              <li key={g.skill} className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-orange-50 text-warn-500 flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                <span className="font-medium text-slate-700">{g.skill}</span>
                <span className="text-xs text-slate-400">gap of {g.gap}%</span>
              </li>
            ))}
          </ol>
          <button onClick={() => navigate('/student/learning-path')} className="btn-primary mt-5">
            View Learning Path <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
