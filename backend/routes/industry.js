const express = require('express')
const IndustryProfile = require('../models/IndustryProfile')
const Internship = require('../models/Internship')
const Job = require('../models/Job')
const StudentProfile = require('../models/StudentProfile')
const Application = require('../models/Application')
const Notification = require('../models/Notification')
const User = require('../models/User')
const { requireAuth, requireRole } = require('../middleware/auth')
const { computeMatch } = require('../utils/matching')

const router = express.Router()

router.use(requireAuth, requireRole('industry'))

// ---------------------------------------------------------------
// COMPANY PROFILE
// ---------------------------------------------------------------

// GET /api/industry/profile
router.get('/profile', async (req, res) => {
  const profile = await IndustryProfile.findOne({ userId: req.user._id })
  res.json(profile)
})

// PUT /api/industry/profile
router.put('/profile', async (req, res) => {
  const profile = await IndustryProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: req.body },
    { new: true, upsert: true }
  )
  res.json(profile)
})

// ---------------------------------------------------------------
// POSTING OPPORTUNITIES
// ---------------------------------------------------------------

// POST /api/industry/internships
router.post('/internships', async (req, res) => {
  const internship = await Internship.create({ ...req.body, companyId: req.user._id, status: 'open' })
  res.status(201).json(internship)
})

// POST /api/industry/jobs
router.post('/jobs', async (req, res) => {
  const job = await Job.create({ ...req.body, companyId: req.user._id })
  res.status(201).json(job)
})

// GET /api/industry/opportunities
router.get('/opportunities', async (req, res) => {
  const [internships, jobs] = await Promise.all([
    Internship.find({ companyId: req.user._id }).sort({ createdAt: -1 }),
    Job.find({ companyId: req.user._id }).sort({ createdAt: -1 })
  ])
  res.json({ internships, jobs })
})

// ---------------------------------------------------------------
// CANDIDATES & AI MATCHING
// ---------------------------------------------------------------

// GET /api/industry/candidates/:type/:oppId
router.get('/candidates/:type/:oppId', async (req, res) => {
  const { type, oppId } = req.params
  const Model = type === 'internship' ? Internship : Job
  const opp = await Model.findById(oppId)
  if (!opp) return res.json([])

  const applicants = await Application.find({ refId: oppId, type })
  const applicantMap = {}
  applicants.forEach((a) => { applicantMap[a.studentId] = a })

  const profiles = await StudentProfile.find()
  const userIds = profiles.map((p) => p.userId)
  const users = await User.find({ _id: { $in: userIds } })
  const userMap = {}
  users.forEach((u) => { userMap[u._id] = u })

  const candidates = profiles.map((profile) => {
    const match = computeMatch(profile, opp)
    const application = applicantMap[profile.userId]
    return {
      studentId: profile.userId,
      name: userMap[profile.userId]?.name,
      college: profile.college,
      branch: profile.branch,
      cgpa: profile.cgpa,
      location: profile.location,
      skillReadiness: profile.skillReadiness,
      applied: Boolean(application),
      applicationStatus: application?.status || null,
      applicationId: application?._id || null,
      ...match
    }
  })

  res.json(candidates.sort((a, b) => b.matchPercent - a.matchPercent))
})

// GET /api/industry/applications
router.get('/applications', async (req, res) => {
  const [internships, jobs] = await Promise.all([
    Internship.find({ companyId: req.user._id }, '_id title'),
    Job.find({ companyId: req.user._id }, '_id title')
  ])
  const oppMap = {}
  ;[...internships, ...jobs].forEach((o) => { oppMap[o._id] = o.title })
  const oppIds = Object.keys(oppMap)

  const applications = await Application.find({ refId: { $in: oppIds } }).sort({ appliedAt: -1 })
  const studentIds = applications.map((a) => a.studentId)
  const [students, users] = await Promise.all([
    StudentProfile.find({ userId: { $in: studentIds } }),
    User.find({ _id: { $in: studentIds } })
  ])
  const studentMap = {}
  students.forEach((s) => { studentMap[s.userId] = s })
  const userMap = {}
  users.forEach((u) => { userMap[u._id] = u })

  const enriched = applications.map((a) => ({
    ...a.toObject(),
    title: oppMap[a.refId],
    studentName: userMap[a.studentId]?.name,
    college: studentMap[a.studentId]?.college
  }))

  res.json(enriched)
})

// PUT /api/industry/applications/:id  { status }
router.put('/applications/:id', async (req, res) => {
  const { status } = req.body
  const application = await Application.findById(req.params.id)
  if (!application) return res.status(404).json({ message: 'Application not found.' })

  application.status = status
  application.timeline.push({ status, at: new Date() })
  await application.save()

  await Notification.create({ userId: application.studentId, text: `Your application status changed to "${status}".` })
  res.json(application)
})

// POST /api/industry/applications/bulk-shortlist  { applicationIds: [] }
router.post('/applications/bulk-shortlist', async (req, res) => {
  const { applicationIds } = req.body
  await Application.updateMany(
    { _id: { $in: applicationIds } },
    { $set: { status: 'Shortlisted' }, $push: { timeline: { status: 'Shortlisted', at: new Date() } } }
  )
  const applications = await Application.find({ _id: { $in: applicationIds } })
  await Notification.insertMany(applications.map((a) => ({
    userId: a.studentId, text: 'You have been shortlisted for an opportunity!'
  })))
  res.json({ success: true })
})

// POST /api/industry/candidates/shortlist  { studentId, oppId, type }
router.post('/candidates/shortlist', async (req, res) => {
  const { studentId, oppId, type } = req.body
  const refModel = type === 'internship' ? 'Internship' : 'Job'

  let application = await Application.findOne({ studentId, refId: oppId, type })
  if (!application) {
    application = await Application.create({
      studentId, type, refId: oppId, refModel, status: 'Shortlisted', timeline: [{ status: 'Shortlisted', at: new Date() }]
    })
  } else {
    application.status = 'Shortlisted'
    application.timeline.push({ status: 'Shortlisted', at: new Date() })
    await application.save()
  }

  await Notification.create({ userId: studentId, text: 'You have been shortlisted by a company via AI matching!' })
  res.json(application)
})

module.exports = router
