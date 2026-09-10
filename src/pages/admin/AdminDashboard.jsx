import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GraduationCap, Building2, Briefcase, TrendingUp } from 'lucide-react'
import DashboardCard from '../../components/DashboardCard'
import {
  fetchAdminAnalytics, fetchAllStudents, fetchAllIndustries
} from '../../features/admin/adminSlice'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { analytics, students, industries } = useSelector((s) => s.admin)

  useEffect(() => {
    dispatch(fetchAdminAnalytics())
    dispatch(fetchAllStudents())
    dispatch(fetchAllIndustries())
  }, [dispatch])

  if (!analytics) return <div className="text-center py-12 text-slate-400">Loading dashboard…</div>

  const { totalStudents, registeredIndustries, activeInternships, activeJobs, placements, facultyCollaborations, funnel, topSkills, skillReadinessBuckets } = analytics

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-orange-900 to-orange-800 text-white border-none">
        <h2 className="text-2xl font-bold">Platform Dashboard</h2>
        <p className="text-slate-300 text-sm mt-1">Institutional & platform-wide analytics at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={GraduationCap} label="Students" value={totalStudents} accent="teal" />
        <DashboardCard icon={Building2} label="Companies" value={registeredIndustries} accent="blue" />
        <DashboardCard icon={Briefcase} label="Opportunities" value={activeInternships + activeJobs} accent="orange" />
        <DashboardCard icon={TrendingUp} label="Placements" value={placements} accent="navy" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Application Pipeline</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={funnel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Top Skills in Demand</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">Student Skill Distribution</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>High (80%+)</span>
              <span className="font-semibold text-teal-600">{skillReadinessBuckets['81-100']}</span>
            </div>
            <div className="flex justify-between">
              <span>Medium (60-80%)</span>
              <span className="font-semibold text-orange-600">{skillReadinessBuckets['61-80']}</span>
            </div>
            <div className="flex justify-between">
              <span>Low (40-60%)</span>
              <span className="font-semibold text-red-600">{skillReadinessBuckets['41-60']}</span>
            </div>
            <div className="flex justify-between">
              <span>Very Low (0-40%)</span>
              <span className="font-semibold text-danger-600">{skillReadinessBuckets['0-40']}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">Platform Health</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Active Internships</span>
              <span className="font-semibold">{activeInternships}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Jobs</span>
              <span className="font-semibold">{activeJobs}</span>
            </div>
            <div className="flex justify-between">
              <span>Placement Rate</span>
              <span className="font-semibold text-teal-600">{totalStudents ? Math.round((placements / totalStudents) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Faculty Collaborations</span>
              <span className="font-semibold">{facultyCollaborations}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">Institutional Stats</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Verified Companies</span>
              <span className="font-semibold">{industries.filter((i) => i.verified).length} / {industries.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Profile Completion</span>
              <span className="font-semibold">{students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.profileCompletion || 0), 0) / students.length) : 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Certificates Verified</span>
              <span className="font-semibold">—</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Uptime</span>
              <span className="font-semibold text-teal-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
