import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell, CartesianGrid } from 'recharts'
import { Briefcase, GraduationCap, Users, FileCheck2, PlusCircle } from 'lucide-react'
import DashboardCard from '../../components/DashboardCard'
import { fetchCompanyOpportunities, fetchCompanyApplications } from '../../features/industry/industrySlice'
import { fetchAdminAnalytics } from '../../features/admin/adminSlice'

const FUNNEL_COLORS = ['#14b8a6', '#f97316', '#3b82f6', '#a855f7', '#ef4444']

export default function IndustryDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { internships, jobs, applications } = useSelector((s) => s.industry)
  const { analytics } = useSelector((s) => s.admin)

  useEffect(() => {
    if (!user) return
    dispatch(fetchCompanyOpportunities(user.id))
    dispatch(fetchCompanyApplications(user.id))
    dispatch(fetchAdminAnalytics())
  }, [user, dispatch])

  const activeJobs = jobs.filter((j) => !j.archived).length
  const activeInternships = internships.filter((i) => i.status === 'open').length
  const totalApplications = applications.length
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length

  const statusCounts = {}
  applications.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1 })
  const funnelData = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']
    .map((s) => ({ name: s, value: statusCounts[s] || 0 }))
    .filter((d) => d.value > 0)

  const skillDemand = analytics?.topSkills || []

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-blue-900 to-blue-800 text-white border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Welcome, {user?.name.split(' ')[0]} </h2>
            <p className="text-slate-300 text-sm mt-1">Manage your talent acquisition and industry partnership.</p>
          </div>
          <button onClick={() => navigate('/industry/post-job')} className="btn bg-white text-blue-600 hover:bg-slate-100 flex items-center gap-2 shrink-0">
            <PlusCircle size={16} /> Post Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Briefcase} label="Active Jobs" value={activeJobs} accent="blue" />
        <DashboardCard icon={GraduationCap} label="Active Internships" value={activeInternships} accent="teal" />
        <DashboardCard icon={FileCheck2} label="Total Applications" value={totalApplications} accent="orange" />
        <DashboardCard icon={Users} label="Shortlisted" value={shortlisted} accent="navy" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Application Funnel</h3>
          {funnelData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No applications yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={funnelData} fill="#14b8a6" isAnimationActive>
                  {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />)}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Top Demanded Skills</h3>
          {skillDemand.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={skillDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Recent Applications</h3>
        {applications.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No applications yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{app.studentName}</p>
                  <p className="text-xs text-slate-500">{app.title}</p>
                </div>
                <span className={`badge text-xs ${
                  app.status === 'Shortlisted' ? 'badge-green' :
                  app.status === 'Under Review' ? 'badge-orange' :
                  app.status === 'Interview' ? 'badge-blue' :
                  app.status === 'Selected' ? 'badge-green' : 'badge-slate'
                }`}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
