const express = require('express')
const StudentProfile = require('../models/StudentProfile')
const IndustryProfile = require('../models/IndustryProfile')
const Internship = require('../models/Internship')
const Job = require('../models/Job')
const Application = require('../models/Application')
const User = require('../models/User')
const VerificationRequest = require('../models/VerificationRequest')
const Certificate = require('../models/Certificate')
const { FacultyOpportunity, Collaboration } = require('../models/Collaboration')
const Notification = require('../models/Notification')
const { requireAuth, requireRole } = require('../middleware/auth')

const router = express.Router()

router.use(requireAuth, requireRole('admin'))

// GET /api/admin/students
router.get('/students', async (req, res) => {
  const profiles = await StudentProfile.find()
  const users = await User.find({ _id: { $in: profiles.map((p) => p.userId) } })
  const userMap = {}
  users.forEach((u) => { userMap[u._id] = u })
  res.json(profiles.map((p) => ({ ...p.toObject(), name: userMap[p.userId]?.name, email: userMap[p.userId]?.email })))
})

// GET /api/admin/industries
router.get('/industries', async (req, res) => {
  const profiles = await IndustryProfile.find()
  const enriched = await Promise.all(profiles.map(async (p) => {
    const user = await User.findById(p.userId)
    const internshipCount = await Internship.countDocuments({ companyId: p.userId })
    const jobCount = await Job.countDocuments({ companyId: p.userId })
    return { ...p.toObject(), email: user?.email, internshipCount, jobCount }
  }))
  res.json(enriched)
})

// PUT /api/admin/industries/:companyId/verify  { approve: boolean }
router.put('/industries/:companyId/verify', async (req, res) => {
  const { approve } = req.body
  const profile = await IndustryProfile.findOneAndUpdate(
    { userId: req.params.companyId },
    { verified: approve },
    { new: true }
  )
  await VerificationRequest.deleteMany({ type: 'industry', refId: req.params.companyId })
  await Notification.create({
    userId: req.params.companyId,
    text: approve ? 'Your company has been verified by the institution.' : 'Your verification request was declined.'
  })
  res.json(profile)
})

// PUT /api/admin/certificates/:certId/verify  { approve: boolean }
router.put('/certificates/:certId/verify', async (req, res) => {
  const { approve } = req.body
  const cert = await Certificate.findByIdAndUpdate(req.params.certId, { verified: approve }, { new: true })
  await VerificationRequest.deleteMany({ refId: req.params.certId })
  if (cert) {
    await Notification.create({
      userId: cert.studentId,
      text: approve ? `Your certificate "${cert.name}" has been verified.` : `Your certificate "${cert.name}" verification was declined.`
    })
  }
  res.json(cert)
})

// GET /api/admin/verification-requests
router.get('/verification-requests', async (req, res) => {
  const requests = await VerificationRequest.find().sort({ submittedAt: -1 })
  res.json(requests)
})

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  const students = await StudentProfile.find()
  const industries = await IndustryProfile.find()
  const totalStudents = students.length
  const registeredIndustries = industries.length
  const activeInternships = await Internship.countDocuments({ status: 'open' })
  const activeJobs = await Job.countDocuments()
  const placements = await Application.countDocuments({ status: 'Selected' })
  const facultyCollaborations = await Collaboration.countDocuments()

  const skillReadinessBuckets = { '0-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
  students.forEach((s) => {
    const r = s.skillReadiness || 0
    if (r <= 40) skillReadinessBuckets['0-40']++
    else if (r <= 60) skillReadinessBuckets['41-60']++
    else if (r <= 80) skillReadinessBuckets['61-80']++
    else skillReadinessBuckets['81-100']++
  })

  const [internships, jobs] = await Promise.all([Internship.find(), Job.find()])
  const skillDemand = {}
  ;[...internships, ...jobs].forEach((o) => {
    ;(o.requiredSkills || []).forEach((s) => { skillDemand[s] = (skillDemand[s] || 0) + 1 })
  })
  const topSkills = Object.entries(skillDemand).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([skill, count]) => ({ skill, count }))

  const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']
  const funnel = await Promise.all(statuses.map(async (status) => ({
    status, count: await Application.countDocuments({ status })
  })))

  const departments = ['Computer Science', 'Information Technology', 'Electronics']
  const skillsToTrack = ['React', 'Python', 'Cloud (AWS)', 'Machine Learning']
  const departmentHeatmap = departments.map((dept) => {
    const deptStudents = students.filter((s) => s.branch === dept)
    const row = { department: dept }
    skillsToTrack.forEach((skill) => {
      const vals = deptStudents
        .map((s) => (s.technicalSkills || []).find((t) => t.name === skill)?.level)
        .filter((v) => v !== undefined)
      row[skill] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
    })
    return row
  })

  res.json({
    totalStudents, registeredIndustries, activeInternships, activeJobs, placements, facultyCollaborations,
    skillReadinessBuckets, topSkills, funnel, departmentHeatmap,
    internshipParticipation: await Application.countDocuments({ type: 'internship' }),
    placementPercentage: totalStudents ? Math.round((placements / totalStudents) * 100) : 0
  })
})

// GET /api/admin/faculty-opportunities
router.get('/faculty-opportunities', async (req, res) => {
  const opportunities = await FacultyOpportunity.find()
  const companyIds = [...new Set(opportunities.map((o) => String(o.companyId)))]
  const profiles = await IndustryProfile.find({ userId: { $in: companyIds } })
  const nameMap = {}
  profiles.forEach((p) => { nameMap[p.userId] = p.companyName })
  res.json(opportunities.map((o) => ({ ...o.toObject(), company: nameMap[o.companyId] })))
})

// GET /api/admin/collaborations
router.get('/collaborations', async (req, res) => {
  const collabs = await Collaboration.find()
  const companyIds = [...new Set(collabs.map((c) => String(c.companyId)))]
  const profiles = await IndustryProfile.find({ userId: { $in: companyIds } })
  const nameMap = {}
  profiles.forEach((p) => { nameMap[p.userId] = p.companyName })
  res.json(collabs.map((c) => ({ ...c.toObject(), company: nameMap[c.companyId] })))
})

module.exports = router
