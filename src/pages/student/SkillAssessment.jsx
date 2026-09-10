import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, XCircle, Sparkles, RotateCcw } from 'lucide-react'
import SkillRadar from '../../components/SkillRadar'
import { apiGetNextAssessmentQuestion } from '../../services/mockApi'
import { fetchAssessmentResult, submitAssessment } from '../../features/student/studentSlice'
import { pushToast } from '../../features/ui/uiSlice'

const TOTAL_QUESTIONS = 10

export default function SkillAssessment() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { assessmentResult } = useSelector((s) => s.student)

  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(null)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (user) dispatch(fetchAssessmentResult(user.id)) }, [user, dispatch])

  async function loadNext(answeredList, lastCorrect) {
    setLoading(true)
    const q = await apiGetNextAssessmentQuestion(answeredList.map((a) => a.questionId), lastCorrect)
    setCurrent(q)
    setSelected(null)
    setFeedback(null)
    setLoading(false)
  }

  function startAssessment() {
    setStarted(true)
    setAnswers([])
    loadNext([], null)
  }

  function selectOption(idx) {
    if (feedback) return
    setSelected(idx)
    const correct = idx === current.answer
    setFeedback(correct ? 'correct' : 'incorrect')
    const newAnswers = [...answers, { questionId: current.id, category: current.category, correct, difficulty: current.difficulty }]
    setAnswers(newAnswers)
  }

  async function handleNext() {
    if (answers.length >= TOTAL_QUESTIONS) {
      const result = await dispatch(submitAssessment({ userId: user.id, answers }))
      if (submitAssessment.fulfilled.match(result)) {
        dispatch(pushToast('Assessment complete! Your skill profile has been updated.', 'success'))
        setStarted(false)
        setCurrent(null)
      }
      return
    }
    const lastCorrect = answers[answers.length - 1]?.correct
    loadNext(answers, lastCorrect)
  }

  // Results view
  if (!started && assessmentResult) {
    const radarData = Object.entries(assessmentResult.breakdown).map(([subject, value]) => ({ subject, value }))
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="card bg-gradient-to-r from-teal-500 to-teal-600 text-white border-none flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-teal-100">Overall Skill Score</p>
            <p className="text-4xl font-bold">{assessmentResult.overallScore}%</p>
          </div>
          <button onClick={startAssessment} className="btn bg-white text-teal-600 hover:bg-teal-50">
            <RotateCcw size={16} /> Retake Assessment
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-2">Score Breakdown</h3>
            <SkillRadar data={radarData} />
          </div>
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-teal-700 mb-2 flex items-center gap-2"><CheckCircle2 size={16} /> Strengths</h3>
              <div className="flex flex-wrap gap-2">{assessmentResult.strengths.map((s) => <span key={s} className="badge-green">{s}</span>)}</div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-warn-500 mb-2 flex items-center gap-2"><XCircle size={16} /> Skill Gaps</h3>
              <div className="flex flex-wrap gap-2">{assessmentResult.gaps.map((s) => <span key={s} className="badge-orange">{s}</span>)}</div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><Sparkles size={16} className="text-teal-500" /> Recommended Roles</h3>
              <div className="flex flex-wrap gap-2">{assessmentResult.recommendedRoles.map((s) => <span key={s} className="badge-blue">{s}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Intro / start view
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center card py-14">
        <Sparkles size={36} className="mx-auto text-teal-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">AI-Powered Skill Assessment</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          10 adaptive questions across Technical, Aptitude and Soft Skills. Difficulty adjusts based on how you answer.
        </p>
        <button onClick={startAssessment} className="btn-primary mt-6 px-8 py-3">Start Assessment</button>
      </div>
    )
  }

  if (loading || !current) {
    return <div className="max-w-2xl mx-auto text-center py-20 text-slate-400">Loading next question…</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>Question {answers.length + 1} / {TOTAL_QUESTIONS}</span>
          <span className="badge-slate capitalize">{current.category} • {current.difficulty}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-2 bg-teal-500 rounded-full transition-all" style={{ width: `${(answers.length / TOTAL_QUESTIONS) * 100}%` }} />
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 text-lg mb-5">{current.text}</h3>
        <div className="space-y-2.5">
          {current.options.map((opt, idx) => {
            let style = 'border-slate-200 hover:border-teal-300 hover:bg-teal-50/40'
            if (feedback) {
              if (idx === current.answer) style = 'border-teal-400 bg-teal-50 text-teal-700'
              else if (idx === selected) style = 'border-danger-400 bg-red-50 text-danger-600'
              else style = 'border-slate-100 text-slate-400'
            }
            return (
              <button
                key={idx}
                onClick={() => selectOption(idx)}
                disabled={!!feedback}
                className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition-colors ${style}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className="mt-5 flex items-center justify-between">
            <p className={`text-sm font-medium flex items-center gap-2 ${feedback === 'correct' ? 'text-teal-600' : 'text-danger-500'}`}>
              {feedback === 'correct' ? <><CheckCircle2 size={16} /> Correct!</> : <><XCircle size={16} /> Not quite right.</>}
            </p>
            <button onClick={handleNext} className="btn-primary">
              {answers.length >= TOTAL_QUESTIONS ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
