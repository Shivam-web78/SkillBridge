const express = require('express')
const multer = require('multer')
const StudentProfile = require('../models/StudentProfile')
const Internship = require('../models/Internship')
const Job = require('../models/Job')
const Course = require('../models/Course')
const LearningProgress = require('../models/LearningProgress')
const AssessmentResult = require('../models/AssessmentResult')
const Application = require('../models/Application')
const Certificate = require('../models/Certificate')
const IndustryProfile = require('../models/IndustryProfile')
const Notification = require('../models/Notification')
const VerificationRequest = require('../models/VerificationRequest')
const User = require('../models/User')
const { requireAuth, requireRole } = require('../middleware/auth')
const { computeMatch } = require('../utils/matching')
const { assessmentBank } = require('../data/assessmentBank')

const router = express.Router()
const upload = multer({ dest: 'uploads/resumes/' })

router.use(requireAuth, requireRole('student'))

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

// ---------------------------------------------------------------
// PROFILE
// ---------------------------------------------------------------

// GET /api/student/profile
router.get('/profile', async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id })
  res.json(profile)
})

// PUT /api/student/profile
router.put('/profile', async (req, res) => {
  const profile = await StudentProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: req.body },
    { new: true, upsert: true }
  )
  res.json(profile)
})

// POST /api/student/resume  (multipart/form-data, field name "resume")
// In production this would run the file through a resume parser
// (e.g. an LLM extraction call or a dedicated parsing service). Here
// we return simulated extracted fields, matching apiUploadResume in
// src/services/mockApi.js.
router.post('/resume', upload.single('resume'), async (req, res) => {
  const extracted = {
    technicalSkills: [
      { name: 'React', level: 65 }, { name: 'JavaScript', level: 75 }, { name: 'Node.js', level: 40 }
    ],
    projects: [{ title: 'Extracted Project from Resume', desc: 'Detected from resume text via parsing.', tech: ['React', 'Node.js'] }],
    certifications: ['Detected Certification (from resume)'],
    resumeFileName: req.file?.originalname || 'resume.pdf'
  }
  res.json(extracted)
})

// ---------------------------------------------------------------
// SKILL ASSESSMENT
// ---------------------------------------------------------------

// GET /api/student/assessment/questions
router.get('/assessment/questions', async (req, res) => {
  res.json(assessmentBank)
})

// GET /api/student/assessment/next?answeredIds=t1,t2&lastCorrect=true
router.get('/assessment/next', async (req, res) => {
  const answeredIds = (req.query.answeredIds || '').split(',').filter(Boolean)
  const lastCorrect = req.query.lastCorrect === 'true' ? true : req.query.lastCorrect === 'false' ? false : null

  const pools = ['technical', 'aptitude', 'soft']
  const flat = pools.flatMap((p) => assessmentBank[p].map((q) => ({ ...q, category: p })))
  const remaining = flat.filter((q) => !answeredIds.includes(q.id))
  if (!remaining.length) return res.json(null)

  const targetDifficulty = lastCorrect === null ? 'easy' : lastCorrect ? (Math.random() > 0.4 ? 'medium' : 'hard') : 'easy'
  const byDifficulty = remaining.filter((q) => q.difficulty === targetDifficulty)
  const pool = byDifficulty.length ? byDifficulty : remaining
  res.json(pool[Math.floor(Math.random() * pool.length)])
})

// POST /api/student/assessment/submit  { answers: [{questionId, category, correct, difficulty}] }
router.post('/assessment/submit', async (req, res) => {
  const { answers } = req.body
  const byCategory = { technical: [], aptitude: [], soft: [] }
  answers.forEach((a) => byCategory[a.category]?.push(a))

  const scoreOf = (arr) => (arr.length ? Math.round((arr.filter((a) => a.correct).length / arr.length) * 100) : 60)
  const technical = scoreOf(byCategory.technical)
  const aptitude = scoreOf(byCategory.aptitude)
  const soft = scoreOf(byCategory.soft)
  const overallScore = Math.round(technical * 0.5 + aptitude * 0.25 + soft * 0.25)

  const breakdown = {
    Technical: technical,
    'Problem Solving': Math.round((technical + aptitude) / 2),
    Communication: soft,
    Programming: technical,
    'Domain Knowledge': Math.round(technical * 0.8),
    'Soft Skills': soft
  }

  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1])
  const strengths = sorted.slice(0, 3).map(([k]) => k)
  const gaps = sorted.slice(-3).map(([k]) => k)

  const result = await AssessmentResult.findOneAndUpdate(
    { studentId: req.user._id },
    {
      studentId: req.user._id,
      overallScore,
      breakdown,
      strengths,
      gaps,
      recommendedSkills: gaps.includes('Technical') ? ['Node.js', 'System Design', 'REST APIs'] : ['System Design', 'Cloud (AWS)'],
      recommendedRoles: overallScore >= 75 ? ['Full Stack Developer', 'SDE'] : ['Frontend Developer', 'QA Engineer']
    },
    { new: true, upsert: true }
  )

  await StudentProfile.findOneAndUpdate(
    { userId: req.user._id },
    [{ $set: { skillReadiness: overallScore, profileCompletion: { $min: [100, { $add: ['$profileCompletion', 5] }] } } }]
  )

  res.json(result)
})

// GET /api/student/assessment/result
router.get('/assessment/result', async (req, res) => {
  const result = await AssessmentResult.findOne({ studentId: req.user._id })
  res.json(result)
})

// ---------------------------------------------------------------
// SKILL GAP & LEARNING
// ---------------------------------------------------------------

const INDUSTRY_REQUIREMENTS = {
  React: 85, 'Node.js': 75, MongoDB: 70, 'System Design': 70, 'REST APIs': 80,
  JavaScript: 85, 'Cloud (AWS)': 65, Python: 70, 'Machine Learning': 70, SQL: 70
}

// GET /api/student/skill-gap
router.get('/skill-gap', async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id })
  if (!profile) return res.json([])
  const studentSkillMap = {}
  ;(profile.technicalSkills || []).forEach((s) => { studentSkillMap[s.name] = s.level })

  const gaps = Object.entries(INDUSTRY_REQUIREMENTS)
    .filter(([skill]) => studentSkillMap[skill] !== undefined)
    .map(([skill, required]) => ({ skill, student: studentSkillMap[skill], required, gap: Math.max(0, required - studentSkillMap[skill]) }))
    .sort((a, b) => b.gap - a.gap)

  res.json(gaps)
})

// GET /api/student/courses
router.get('/courses', async (req, res) => {
  const courses = await Course.find()
  res.json(courses)
})

// GET /api/student/learning-progress
router.get('/learning-progress', async (req, res) => {
  const entries = await LearningProgress.find({ studentId: req.user._id })
  const map = {}
  entries.forEach((e) => { map[e.courseId] = e.status })
  res.json(map)
})

// PUT /api/student/learning-progress/:courseId  { status }
router.put('/learning-progress/:courseId', async (req, res) => {
  const entry = await LearningProgress.findOneAndUpdate(
    { studentId: req.user._id, courseId: req.params.courseId },
    { status: req.body.status },
    { new: true, upsert: true }
  )
  res.json(entry)
})

// ---------------------------------------------------------------
// OPPORTUNITIES
// ---------------------------------------------------------------

async function withCompanyName(docs) {
  const companyIds = [...new Set(docs.map((d) => String(d.companyId)))]
  const profiles = await IndustryProfile.find({ userId: { $in: companyIds } })
  const nameMap = {}
  profiles.forEach((p) => { nameMap[p.userId] = p.companyName })
  return docs.map((d) => ({ ...d.toObject(), company: nameMap[d.companyId] || 'Company' }))
}

// GET /api/student/internships?search=&location=&remote=
router.get('/internships', async (req, res) => {
  const { search, location, remote } = req.query
  const query = { status: 'open' }
  if (search) query.$or = [{ title: new RegExp(search, 'i') }, { requiredSkills: new RegExp(search, 'i') }]
  if (location) query.location = location
  if (remote === 'true') query.remote = true

  const internships = await Internship.find(query).sort({ createdAt: -1 })
  res.json(await withCompanyName(internships))
})

// GET /api/student/jobs?search=&location=
router.get('/jobs', async (req, res) => {
  const { search, location } = req.query
  const query = { archived: { $ne: true } }
  if (search) query.$or = [{ title: new RegExp(search, 'i') }, { requiredSkills: new RegExp(search, 'i') }]
  if (location) query.location = location

  const jobs = await Job.find(query).sort({ createdAt: -1 })
  res.json(await withCompanyName(jobs))
})

// GET /api/student/recommendations
router.get('/recommendations', async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id })
  if (!profile) return res.json({ internships: [], jobs: [] })

  const [internshipDocs, jobDocs] = await Promise.all([
    Internship.find({ status: 'open' }),
    Job.find({ archived: { $ne: true } })
  ])

  const rankTop5 = (opportunities) => opportunities
    .map((opp) => ({ ...opp, ...computeMatch(profile, opp) }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5)

  const internshipsWithCompany = await withCompanyName(internshipDocs)
  const jobsWithCompany = await withCompanyName(jobDocs)

  res.json({
    internships: rankTop5(internshipsWithCompany),
    jobs: rankTop5(jobsWithCompany)
  })
})

// GET /api/student/opportunity-match/:type/:oppId
router.get('/opportunity-match/:type/:oppId', async (req, res) => {
  const { type, oppId } = req.params
  const profile = await StudentProfile.findOne({ userId: req.user._id })
  const Model = type === 'internship' ? Internship : Job
  const opp = await Model.findById(oppId)
  if (!profile || !opp) return res.status(404).json(null)

  const [company] = await withCompanyName([opp])
  res.json({ ...company, ...computeMatch(profile, opp) })
})

// POST /api/student/apply  { type, refId }
router.post('/apply', async (req, res) => {
  const { type, refId } = req.body
  const refModel = type === 'internship' ? 'Internship' : 'Job'

  const existing = await Application.findOne({ studentId: req.user._id, refId, type })
  if (existing) return res.status(409).json({ message: 'You have already applied to this opportunity.' })

  const application = await Application.create({
    studentId: req.user._id, type, refId, refModel, status: 'Applied', timeline: [{ status: 'Applied', at: new Date() }]
  })

  const Model = refModel === 'Internship' ? Internship : Job
  const opp = await Model.findById(refId)
  if (opp) {
    await Notification.create({ userId: opp.companyId, text: `New application received for "${opp.title}".` })
  }
  res.status(201).json(application)
})

// GET /api/student/applications
router.get('/applications', async (req, res) => {
  const applications = await Application.find({ studentId: req.user._id }).sort({ appliedAt: -1 })
  const enriched = await Promise.all(applications.map(async (a) => {
    const Model = a.type === 'internship' ? Internship : Job
    const opp = await Model.findById(a.refId)
    const [company] = opp ? await withCompanyName([opp]) : [{}]
    return { ...a.toObject(), title: opp?.title, company: company?.company }
  }))
  res.json(enriched)
})

// ---------------------------------------------------------------
// CERTIFICATES & PORTFOLIO
// ---------------------------------------------------------------

// GET /api/student/certificates
router.get('/certificates', async (req, res) => {
  const certs = await Certificate.find({ studentId: req.user._id })
  res.json(certs)
})

// POST /api/student/certificates  { name, issuer }
router.post('/certificates', async (req, res) => {
  const { name, issuer } = req.body
  const cert = await Certificate.create({
    studentId: req.user._id, name, issuer, credentialId: uid('CR').toUpperCase(), verified: false
  })
  await VerificationRequest.create({ type: 'certificate', refId: cert._id, studentId: req.user._id, name })
  res.status(201).json(cert)
})

// GET /api/student/portfolio
router.get('/portfolio', async (req, res) => {
  const [profile, certs, assessment, applications] = await Promise.all([
    StudentProfile.findOne({ userId: req.user._id }),
    Certificate.find({ studentId: req.user._id }),
    AssessmentResult.findOne({ studentId: req.user._id }),
    Application.find({ studentId: req.user._id })
  ])

  res.json({
    name: req.user.name,
    profile,
    certificates: certs,
    assessment,
    applications,
    portfolioUrl: `${process.env.CLIENT_URL}/portfolio/${req.user._id}`
  })
})

module.exports = router
