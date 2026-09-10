import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { Target, TrendingUp, Briefcase, FileCheck2, Award, FolderKanban } from 'lucide-react'
import DashboardCard from '../../components/DashboardCard'
import ProgressBar from '../../components/ProgressBar'
import SkillRadar from '../../components/SkillRadar'
import OpportunityCard from '../../components/OpportunityCard'
import EmptyState from '../../components/EmptyState'
import {
  fetchStudentProfile, fetchAssessmentResult, fetchRecommendations,
  fetchApplications, fetchCertificates, applyToOpportunity
} from '../../features/student/studentSlice'
import { pushToast } from '../../features/ui/uiSlice'

const STATUS_COLORS = { Applied: '#94a3b8', 'Under Review': '#f97316', Shortlisted: '#3b82f6', Interview: '#a855f7', Selected: '#14b8a6', Rejected: '#ef4444' }

export default function StudentDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { profile, assessmentResult, recommendations, applications, certificates } = useSelector((s) => s.student)

  useEffect(() => {
    if (!user) return
    dispatch(fetchStudentProfile(user.id))
    dispatch(fetchAssessmentResult(user.id))
    dispatch(fetchRecommendations(user.id))
    dispatch(fetchApplications(user.id))
    dispatch(fetchCertificates(user.id))
  }, [user, dispatch])

  if (!profile) return null

  const radarData = assessmentResult
    ? Object.entries(assessmentResult.breakdown).map(([subject, value]) => ({ subject, value }))
    : (profile.technicalSkills || []).slice(0, 6).map((s) => ({ subject: s.name, value: s.level }))

  const statusCounts = {}
  applications.forEach((a) => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1 })
  const funnelData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }))

  async function handleApply(opp, type) {
    const result = await dispatch(applyToOpportunity({ userId: user.id, type, refId: opp.id }))
    if (applyToOpportunity.fulfilled.match(result)) {
      dispatch(pushToast(`Applied to ${opp.title}!`, 'success'))
    } else {
      dispatch(pushToast(result.payload || 'Could not apply.', 'error'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-r from-navy-900 to-navy-800 text-white border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Welcome, {user.name.split(' ')[0]} </h2>
            <p className="text-slate-300 text-sm mt-1">Here's a snapshot of your skill journey today.</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-400">Profile completion</p>
              <p className="text-2xl font-bold text-teal-400">{profile.profileCompletion}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Skill readiness</p>
              <p className="text-2xl font-bold text-teal-400">{profile.skillReadiness}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Target} label="Skill Score" value={`${profile.skillReadiness}%`} accent="teal" />
        <DashboardCard icon={TrendingUp} label="Skill Gaps Identified" value={assessmentResult ? assessmentResult.gaps.length : '—'} accent="orange" />
        <DashboardCard icon={Briefcase} label="Recommended" value={recommendations.internships.length + recommendations.jobs.length} accent="blue" />
        <DashboardCard icon={FileCheck2} label="Applications" value={applications.length} accent="navy" />
        <DashboardCard icon={Award} label="Certificates" value={certificates.length} accent="teal" />
        <DashboardCard icon={FolderKanban} label="Portfolio Strength" value={`${Math.min(100, profile.profileCompletion)}%`} accent="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-1">Skill Competency Radar</h3>
          <p className="text-xs text-slate-400 mb-2">{assessmentResult ? 'Based on your latest assessment' : 'Based on your profile skills — take an assessment for a fuller picture'}</p>
          <SkillRadar data={radarData} />
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Application Status</h3>
          {funnelData.length === 0 ? (
            <EmptyState title="No applications yet" description="Apply to internships or jobs to see your funnel here." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={funnelData} dataKey="count" nameKey="status" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {funnelData.map((entry) => <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Skill Gap Snapshot</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {(profile.technicalSkills || []).slice(0, 4).map((s) => (
            <ProgressBar key={s.name} label={s.name} value={s.level} color={s.level >= 70 ? 'teal' : s.level >= 45 ? 'orange' : 'red'} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Recommended for You</h3>
          <button onClick={() => navigate('/student/internships')} className="text-sm text-teal-600 hover:underline">View all internships</button>
        </div>
        <div className="space-y-3">
          {recommendations.internships.slice(0, 3).map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              applied={applications.some((a) => a.refId === opp.id)}
              onApply={() => handleApply(opp, 'internship')}
              onViewDetails={() => navigate('/student/internships')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
