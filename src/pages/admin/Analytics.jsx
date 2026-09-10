import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { fetchAdminAnalytics } from '../../features/admin/adminSlice'

const COLORS = ['#14b8a6', '#f97316', '#3b82f6', '#a855f7', '#ef4444']

export default function AdminAnalytics() {
  const dispatch = useDispatch()
  const { analytics } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchAdminAnalytics()) }, [dispatch])

  if (!analytics) return <div className="text-center py-12 text-slate-400">Loading analytics…</div>

  const { funnel, topSkills, skillReadinessBuckets, departmentHeatmap } = analytics

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none flex items-center gap-3">
        <BarChart3 size={24} />
        <div>
          <h2 className="text-lg font-bold">Platform Analytics</h2>
          <p className="text-slate-200 text-sm">Comprehensive institutional insights</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Application Funnel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Top Skills Demanded</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Skill Readiness Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={Object.entries(skillReadinessBuckets).map(([name, value]) => ({ name, value }))}
                cx="50%" cy="50%" labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={75} dataKey="value"
              >
                {Object.keys(skillReadinessBuckets).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Department-wise Skill Readiness Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-3">Department</th>
                  {departmentHeatmap && departmentHeatmap[0] && Object.keys(departmentHeatmap[0]).filter((k) => k !== 'department').map((skill) => (
                    <th key={skill} className="py-2 px-3">{skill}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departmentHeatmap && departmentHeatmap.map((row) => (
                  <tr key={row.department} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-3 font-medium text-slate-700">{row.department}</td>
                    {Object.entries(row).filter(([k]) => k !== 'department').map(([skill, score]) => (
                      <td key={skill} className="py-2 px-3">
                        <span
                          className="inline-block px-2 py-1 rounded text-white font-medium"
                          style={{ backgroundColor: score >= 75 ? '#14b8a6' : score >= 50 ? '#f97316' : score > 0 ? '#ef4444' : '#cbd5e1' }}
                        >
                          {score}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
