import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GraduationCap } from 'lucide-react'
import { apiGetFacultyOpportunities } from '../../services/mockApi'
import EmptyState from '../../components/EmptyState'

export default function IndustryPrograms() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const data = await apiGetFacultyOpportunities()
      setPrograms(data)
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="text-center py-12 text-slate-400">Loading programs…</div>

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-teal-500 to-teal-600 text-white border-none">
        <h3 className="text-lg font-bold">Industry Learning & Training Programs</h3>
        <p className="text-slate-200 text-sm mt-1">Upskill with industry-backed training, workshops and certifications.</p>
      </div>

      {programs.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No programs available" />
      ) : (
        <div className="grid gap-4">
          {programs.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{p.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{p.company}</p>
                  <p className="text-sm text-slate-700 mt-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge-blue text-xs">{p.type}</span>
                    <span className="badge-slate text-xs">{p.duration}</span>
                  </div>
                </div>
                <button className="btn-primary text-sm shrink-0">Enroll</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
