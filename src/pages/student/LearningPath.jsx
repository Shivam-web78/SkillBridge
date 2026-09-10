import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, CheckCircle2, Clock, Award } from 'lucide-react'
import {
  fetchCourses, fetchLearningProgress, updateLearningProgress, fetchSkillGap
} from '../../features/student/studentSlice'
import { pushToast } from '../../features/ui/uiSlice'
import EmptyState from '../../components/EmptyState'

export default function LearningPath() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { courses, learningProgress, skillGap } = useSelector((s) => s.student)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    dispatch(fetchCourses())
    dispatch(fetchLearningProgress(user.id))
    dispatch(fetchSkillGap(user.id))
  }, [user, dispatch])

  const topGaps = skillGap.filter((g) => g.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 3).map((g) => g.skill)
  const recommended = courses.filter((c) => topGaps.includes(c.skill))
  const allRecommended = [...recommended, ...courses.filter((c) => !topGaps.includes(c.skill))]

  function getStatus(courseId) { return learningProgress[courseId] || 'Not Started' }

  async function updateStatus(courseId, status) {
    await dispatch(updateLearningProgress({ userId: user.id, courseId, status }))
    dispatch(pushToast(`Marked as ${status}.`, 'success'))
  }

  const displayed = filter === 'recommended' ? recommended : filter === 'inProgress' ? allRecommended.filter((c) => getStatus(c.id) === 'In Progress') : allRecommended

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="card bg-gradient-to-r from-navy-900 to-navy-800 text-white border-none">
        <h3 className="text-lg font-bold">Your Personalized Learning Roadmap</h3>
        <p className="text-slate-300 text-sm mt-1">Based on your skill gaps and career goals. Start a course to track your progress.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'recommended', 'inProgress'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`badge text-xs font-medium cursor-pointer ${filter === f ? 'badge-green' : 'badge-slate'}`}>
            {f === 'all' ? 'All Courses' : f === 'recommended' ? 'Gap Fillers' : 'In Progress'}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses to show" description={filter === 'inProgress' ? 'Start a course to see progress here.' : 'Explore and enroll in courses above.'} />
      ) : (
        <div className="grid gap-4">
          {displayed.map((course, idx) => {
            const status = getStatus(course.id)
            const isRecommended = recommended.some((c) => c.id === course.id)
            return (
              <div key={course.id} className="card flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs shrink-0">{idx + 1}</div>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-800">{course.title}</h4>
                      {isRecommended && <span className="badge-orange text-xs">Closes gap</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{course.provider} • {course.duration}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="badge-slate text-xs">{course.skill}</span>
                      <span className={`badge text-xs ${course.difficulty === 'Beginner' ? 'badge-green' : course.difficulty === 'Intermediate' ? 'badge-orange' : 'badge-red'}`}>
                        {course.difficulty}
                      </span>
                      {course.certificate && <span className="badge-blue text-xs flex items-center gap-1"><Award size={10} /> Certificate</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col sm:shrink-0">
                  <select value={status} onChange={(e) => updateStatus(course.id, e.target.value)} className="input text-xs py-2">
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <button className="btn-primary text-xs px-3 py-2">Start</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
