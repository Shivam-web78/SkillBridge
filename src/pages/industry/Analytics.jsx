import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { fetchAdminAnalytics } from '../../features/admin/adminSlice'
import DashboardCard from '../../components/DashboardCard'

const COLORS = ['#14b8a6', '#f97316', '#3b82f6', '#a855f7', '#ef4444']

export default function IndustryAnalytics() {
  const dispatch = useDispatch()
  const { analytics } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchAdminAnalytics()) }, [dispatch])

  if (!analytics) return <div className="text-center py-12 text-slate-400">Loading analytics…</div>

  const { funnel, topSkills, skillReadinessBuckets } = analytics

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none flex items-center gap-3">
        <BarChart3 size={24} />
        <div>
          <h2 className="text-lg font-bold">Analytics & Insights</h2>
          <p className="text-slate-200 text-sm">Candidate pool, application trends, and market insights</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Application Funnel</h3>
          {funnel.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No application data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={funnel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Skill Demand</h3>
          {topSkills.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No skill data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topSkills}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Candidate Skill Readiness Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={Object.entries(skillReadinessBuckets).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.keys(skillReadinessBuckets).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Candidate Pool Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>High skill readiness (80%+)</span>
                <span className="font-semibold text-teal-600">{skillReadinessBuckets['81-100']}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-2 bg-teal-500" style={{ width: `${Math.min(100, (skillReadinessBuckets['81-100'] || 0) * 10)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Medium skill readiness (60-80%)</span>
                <span className="font-semibold text-orange-600">{skillReadinessBuckets['61-80']}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-2 bg-orange-500" style={{ width: `${Math.min(100, (skillReadinessBuckets['61-80'] || 0) * 10)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Needs upskilling (below 60%)</span>
                <span className="font-semibold text-red-600">{(skillReadinessBuckets['0-40'] || 0) + (skillReadinessBuckets['41-60'] || 0)}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-2 bg-red-500" style={{ width: `${Math.min(100, ((skillReadinessBuckets['0-40'] || 0) + (skillReadinessBuckets['41-60'] || 0)) * 10)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
