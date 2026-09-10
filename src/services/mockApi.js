// mockApi.js
//
// A simulated backend for the SkillBridge prototype. Every exported
// function is `async` and shaped like a real REST call (it even
// "network delays" a little) so the rest of the app - and a future
// swap to real axios calls against /backend - doesn't need to change
// shape. All state is persisted to localStorage so the demo survives
// refreshes.
//
// This is intentionally the single source of truth for "server" data
// in the prototype: Redux slices call into here, never straight into
// localStorage.

import {
  seedUsers, seedStudentProfiles, seedIndustryProfiles, seedInternships,
  seedJobs, seedCourses, seedFacultyOpportunities, seedCollaborations,
  assessmentBank, demoAccountIds
} from './seedData'

const DB_KEY = 'skillbridge_db_v1'

function delay(ms = 350) {
  return new Promise((res) => setTimeout(res, ms))
}

function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY)
  if (raw) {
    try { return JSON.parse(raw) } catch { /* fall through to reseed */ }
  }
  const initial = {
    users: seedUsers,
    studentProfiles: seedStudentProfiles,
    industryProfiles: seedIndustryProfiles,
    internships: seedInternships,
    jobs: seedJobs,
    courses: seedCourses,
    facultyOpportunities: seedFacultyOpportunities,
    collaborations: seedCollaborations,
    applications: [],
    assessmentResults: {},
    learningProgress: {},
    notifications: [],
    messages: [],
    certificates: {},
    verificationRequests: []
  }
  // Seed a couple of demo applications + an assessment result + notifications
  // so the demo accounts don't look empty on first load.
  initial.applications = [
    { id: uid('app'), studentId: 'u-stu-1', type: 'internship', refId: 'int-1', status: 'Shortlisted', appliedAt: daysAgo(6), timeline: buildTimeline('Shortlisted') },
    { id: uid('app'), studentId: 'u-stu-1', type: 'internship', refId: 'int-2', status: 'Under Review', appliedAt: daysAgo(3), timeline: buildTimeline('Under Review') },
    { id: uid('app'), studentId: 'u-stu-1', type: 'job', refId: 'job-1', status: 'Applied', appliedAt: daysAgo(1), timeline: buildTimeline('Applied') },
    { id: uid('app'), studentId: 'u-stu-2', type: 'internship', refId: 'int-2', status: 'Interview', appliedAt: daysAgo(8), timeline: buildTimeline('Interview') },
    { id: uid('app'), studentId: 'u-stu-3', type: 'internship', refId: 'int-6', status: 'Applied', appliedAt: daysAgo(2), timeline: buildTimeline('Applied') }
  ]
  initial.assessmentResults = {
    'u-stu-1': {
      completedAt: daysAgo(10),
      overallScore: 74,
      breakdown: { Technical: 70, 'Problem Solving': 78, Communication: 76, Programming: 72, 'Domain Knowledge': 65, 'Soft Skills': 80 },
      strengths: ['Communication', 'Teamwork', 'JavaScript fundamentals'],
      gaps: ['System Design', 'Node.js depth', 'Cloud fundamentals'],
      recommendedSkills: ['Node.js', 'System Design', 'Cloud (AWS)'],
      recommendedRoles: ['Frontend Developer', 'Full Stack Developer']
    }
  }
  initial.learningProgress = {
    'u-stu-1': { 'c-1': 'In Progress', 'c-2': 'Not Started', 'c-5': 'Not Started' }
  }
  initial.certificates = {
    'u-stu-1': [
      { id: uid('cert'), name: 'Meta Front-End Developer', issuer: 'Coursera', issuedDate: '2026-03-12', verified: true, credentialId: 'CR-88213-RS' },
      { id: uid('cert'), name: 'freeCodeCamp JavaScript Algorithms', issuer: 'freeCodeCamp', issuedDate: '2025-11-02', verified: true, credentialId: 'CR-71120-RS' },
      { id: uid('cert'), name: 'System Design Primer (in progress)', issuer: 'Educative', issuedDate: '2026-08-01', verified: false, credentialId: 'CR-90441-RS' }
    ]
  }
  initial.notifications = [
    { id: uid('ntf'), userId: 'u-stu-1', text: 'Your profile matched a Frontend Developer Internship — 92% match.', read: false, createdAt: daysAgo(1) },
    { id: uid('ntf'), userId: 'u-stu-1', text: 'You have been shortlisted for Frontend Developer Intern at TechNova Solutions.', read: false, createdAt: daysAgo(6) },
    { id: uid('ntf'), userId: 'u-stu-1', text: 'Your certificate "Meta Front-End Developer" has been verified.', read: true, createdAt: daysAgo(20) },
    { id: uid('ntf'), userId: 'u-ind-1', text: 'New candidate applications received for Frontend Developer Intern.', read: false, createdAt: daysAgo(1) },
    { id: uid('ntf'), userId: 'u-adm-1', text: 'GreenGrid Energy submitted a verification request.', read: false, createdAt: daysAgo(2) }
  ]
  initial.verificationRequests = [
    { id: uid('ver'), type: 'industry', refId: 'u-ind-4', name: 'GreenGrid Energy', status: 'pending', submittedAt: daysAgo(2) }
  ]
  saveDB(initial)
  return initial
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function buildTimeline(currentStatus) {
  const order = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']
  const idx = order.indexOf(currentStatus)
  return order.slice(0, idx + 1).map((s, i) => ({ status: s, at: daysAgo((idx - i) * 2) }))
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

let db = loadDB()

function persist() { saveDB(db) }

// ---------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------

export async function apiLogin({ email, password, role }) {
  await delay()
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role)
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials. Check your email, password and selected role.')
  }
  const { password: _pw, ...safeUser } = user
  return { user: safeUser, token: `demo-jwt.${user.id}.${Date.now()}` }
}

export async function apiDemoLogin(role) {
  await delay(200)
  const id = demoAccountIds[role]
  const user = db.users.find(u => u.id === id)
  const { password: _pw, ...safeUser } = user
  return { user: safeUser, token: `demo-jwt.${user.id}.${Date.now()}` }
}

export async function apiRegister({ name, email, password, role }) {
  await delay()
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }
  const id = uid('u')
  const newUser = { id, name, email, password, role }
  db.users.push(newUser)
  if (role === 'student') {
    db.studentProfiles[id] = {
      userId: id, college: '', degree: '', branch: '', year: '', cgpa: '', location: '', phone: '',
      careerInterests: [], preferredRoles: [], technicalSkills: [], softSkills: [],
      projects: [], certifications: [], achievements: [], resumeFileName: '',
      profileCompletion: 15, skillReadiness: 0
    }
  }
  if (role === 'industry') {
    db.industryProfiles[id] = { userId: id, companyName: name, industry: '', location: '', size: '', verified: false, about: '' }
  }
  persist()
  const { password: _pw, ...safeUser } = newUser
  return { user: safeUser, token: `demo-jwt.${id}.${Date.now()}` }
}

export async function apiResetPassword({ email, newPassword }) {
  await delay()
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) throw new Error('No account found with that email.')
  user.password = newPassword
  persist()
  return { success: true }
}

// ---------------------------------------------------------------
// SKILL MATCHING ENGINE
// Skill overlap + eligibility + interest + a simple similarity score.
// Mirrors what a real embeddings/vector-similarity service would
// output (a 0-100 match score plus matched / missing skill lists).
// ---------------------------------------------------------------

export function computeMatch(studentProfile, opportunity) {
  const studentSkillMap = {}
  ;(studentProfile.technicalSkills || []).forEach(s => { studentSkillMap[s.name] = s.level })

  const required = opportunity.requiredSkills || []
  let matched = []
  let missing = []
  let skillScoreSum = 0

  required.forEach(skill => {
    const level = studentSkillMap[skill]
    if (level && level >= 50) {
      matched.push({ name: skill, level })
      skillScoreSum += Math.min(level, 100)
    } else if (level) {
      missing.push({ name: skill, level })
      skillScoreSum += level * 0.5
    } else {
      missing.push({ name: skill, level: 0 })
    }
  })

  const skillCoverage = required.length ? skillScoreSum / (required.length * 100) : 0

  const cgpaOk = !opportunity.minCgpa || (Number(studentProfile.cgpa) >= opportunity.minCgpa)
  const eligibilityScore = cgpaOk ? 1 : 0.6

  const interestBoost = (studentProfile.preferredRoles || []).some(r =>
    opportunity.title?.toLowerCase().includes(r.toLowerCase().split(' ')[0])
  ) ? 0.08 : 0

  const rawScore = (skillCoverage * 0.75 + eligibilityScore * 0.2 + interestBoost) * 100
  const matchPercent = Math.max(5, Math.min(99, Math.round(rawScore)))

  return { matchPercent, matched, missing, eligibilityOk: cgpaOk }
}

// ---------------------------------------------------------------
// STUDENT
// ---------------------------------------------------------------

export async function apiGetStudentProfile(userId) {
  await delay(200)
  return db.studentProfiles[userId] || null
}

export async function apiUpdateStudentProfile(userId, updates) {
  await delay()
  db.studentProfiles[userId] = { ...db.studentProfiles[userId], ...updates }
  persist()
  return db.studentProfiles[userId]
}

export async function apiUploadResume(userId, fileName) {
  await delay(900)
  // Simulate resume parsing / AI extraction.
  const extracted = {
    technicalSkills: [
      { name: 'React', level: 65 }, { name: 'JavaScript', level: 75 }, { name: 'Node.js', level: 40 }
    ],
    projects: [{ title: 'Extracted Project from Resume', desc: 'Detected from resume text via parsing.', tech: ['React', 'Node.js'] }],
    certifications: ['Detected Certification (from resume)'],
    resumeFileName: fileName
  }
  return extracted
}

export async function apiGetAssessmentQuestions() {
  await delay(200)
  return assessmentBank
}

function pickAdaptiveNext(bank, answeredIds, lastCorrect) {
  const pools = ['technical', 'aptitude', 'soft']
  const flat = pools.flatMap(p => bank[p].map(q => ({ ...q, category: p })))
  const remaining = flat.filter(q => !answeredIds.includes(q.id))
  if (!remaining.length) return null
  const targetDifficulty = lastCorrect === null ? 'easy' : lastCorrect ? (Math.random() > 0.4 ? 'medium' : 'hard') : 'easy'
  const byDifficulty = remaining.filter(q => q.difficulty === targetDifficulty)
  const pool = byDifficulty.length ? byDifficulty : remaining
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function apiGetNextAssessmentQuestion(answeredIds, lastCorrect) {
  await delay(300)
  return pickAdaptiveNext(assessmentBank, answeredIds, lastCorrect)
}

export async function apiSubmitAssessment(userId, answers) {
  await delay(700)
  // answers: [{questionId, category, correct, difficulty}]
  const byCategory = { technical: [], aptitude: [], soft: [] }
  answers.forEach(a => byCategory[a.category]?.push(a))

  const scoreOf = (arr) => arr.length ? Math.round((arr.filter(a => a.correct).length / arr.length) * 100) : 60
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

  const result = {
    completedAt: new Date().toISOString(),
    overallScore,
    breakdown,
    strengths,
    gaps,
    recommendedSkills: gaps.includes('Technical') ? ['Node.js', 'System Design', 'REST APIs'] : ['System Design', 'Cloud (AWS)'],
    recommendedRoles: overallScore >= 75 ? ['Full Stack Developer', 'SDE'] : ['Frontend Developer', 'QA Engineer']
  }
  db.assessmentResults[userId] = result
  const profile = db.studentProfiles[userId]
  if (profile) {
    profile.skillReadiness = overallScore
    profile.profileCompletion = Math.min(100, (profile.profileCompletion || 0) + 5)
  }
  persist()
  return result
}

export async function apiGetAssessmentResult(userId) {
  await delay(150)
  return db.assessmentResults[userId] || null
}

export async function apiGetSkillGap(userId) {
  await delay(250)
  const profile = db.studentProfiles[userId]
  if (!profile) return []
  const industryRequirements = { React: 85, 'Node.js': 75, MongoDB: 70, 'System Design': 70, 'REST APIs': 80, JavaScript: 85, 'Cloud (AWS)': 65, Python: 70, 'Machine Learning': 70, SQL: 70 }
  const studentSkillMap = {}
  ;(profile.technicalSkills || []).forEach(s => { studentSkillMap[s.name] = s.level })
  return Object.entries(industryRequirements)
    .filter(([skill]) => studentSkillMap[skill] !== undefined)
    .map(([skill, required]) => ({ skill, student: studentSkillMap[skill], required, gap: Math.max(0, required - studentSkillMap[skill]) }))
    .sort((a, b) => b.gap - a.gap)
}

export async function apiGetCourses() {
  await delay(150)
  return db.courses
}

export async function apiGetLearningProgress(userId) {
  await delay(150)
  return db.learningProgress[userId] || {}
}

export async function apiUpdateLearningProgress(userId, courseId, status) {
  await delay(200)
  if (!db.learningProgress[userId]) db.learningProgress[userId] = {}
  db.learningProgress[userId][courseId] = status
  persist()
  return db.learningProgress[userId]
}

export async function apiGetInternships(filters = {}) {
  await delay(250)
  let results = [...db.internships]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(i => i.title.toLowerCase().includes(q) || i.requiredSkills.some(s => s.toLowerCase().includes(q)))
  }
  if (filters.location) results = results.filter(i => i.location === filters.location)
  if (filters.remote === true) results = results.filter(i => i.remote)
  if (filters.domain) results = results.filter(i => i.requiredSkills.includes(filters.domain))
  return results.map(i => ({ ...i, company: db.industryProfiles[i.companyId]?.companyName || 'Company' }))
}

export async function apiGetJobs(filters = {}) {
  await delay(250)
  let results = [...db.jobs]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    results = results.filter(j => j.title.toLowerCase().includes(q) || j.requiredSkills.some(s => s.toLowerCase().includes(q)))
  }
  if (filters.location) results = results.filter(j => j.location === filters.location)
  return results.map(j => ({ ...j, company: db.industryProfiles[j.companyId]?.companyName || 'Company' }))
}

export async function apiGetRecommendations(userId) {
  await delay(400)
  const profile = db.studentProfiles[userId]
  if (!profile) return { internships: [], jobs: [] }
  const internships = db.internships
    .map(i => ({ ...i, company: db.industryProfiles[i.companyId]?.companyName, ...computeMatch(profile, i) }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5)
  const jobs = db.jobs
    .map(j => ({ ...j, company: db.industryProfiles[j.companyId]?.companyName, ...computeMatch(profile, j) }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5)
  return { internships, jobs }
}

export async function apiGetOpportunityMatch(userId, oppId, type) {
  await delay(200)
  const profile = db.studentProfiles[userId]
  const opp = type === 'internship' ? db.internships.find(i => i.id === oppId) : db.jobs.find(j => j.id === oppId)
  if (!profile || !opp) return null
  return { ...opp, company: db.industryProfiles[opp.companyId]?.companyName, ...computeMatch(profile, opp) }
}

export async function apiApply(userId, type, refId) {
  await delay(400)
  const already = db.applications.find(a => a.studentId === userId && a.refId === refId && a.type === type)
  if (already) throw new Error('You have already applied to this opportunity.')
  const application = { id: uid('app'), studentId: userId, type, refId, status: 'Applied', appliedAt: new Date().toISOString(), timeline: buildTimeline('Applied') }
  db.applications.push(application)

  const opp = type === 'internship' ? db.internships.find(i => i.id === refId) : db.jobs.find(j => j.id === refId)
  if (opp) {
    db.notifications.push({ id: uid('ntf'), userId: opp.companyId, text: `New application received for "${opp.title}".`, read: false, createdAt: new Date().toISOString() })
  }
  persist()
  return application
}

export async function apiGetApplications(userId) {
  await delay(250)
  return db.applications
    .filter(a => a.studentId === userId)
    .map(a => {
      const opp = a.type === 'internship' ? db.internships.find(i => i.id === a.refId) : db.jobs.find(j => j.id === a.refId)
      return { ...a, title: opp?.title, company: db.industryProfiles[opp?.companyId]?.companyName }
    })
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
}

export async function apiGetCertificates(userId) {
  await delay(150)
  return db.certificates[userId] || []
}

export async function apiUploadCertificate(userId, name, issuer) {
  await delay(500)
  if (!db.certificates[userId]) db.certificates[userId] = []
  const cert = { id: uid('cert'), name, issuer, issuedDate: new Date().toISOString().slice(0, 10), verified: false, credentialId: uid('CR').toUpperCase() }
  db.certificates[userId].push(cert)
  db.verificationRequests.push({ id: uid('ver'), type: 'certificate', refId: cert.id, studentId: userId, name, status: 'pending', submittedAt: new Date().toISOString() })
  persist()
  return cert
}

export async function apiGetPortfolio(userId) {
  await delay(300)
  const profile = db.studentProfiles[userId]
  const user = db.users.find(u => u.id === userId)
  const certs = db.certificates[userId] || []
  const assessment = db.assessmentResults[userId] || null
  const applications = db.applications.filter(a => a.studentId === userId)
  return { name: user?.name, profile, certificates: certs, assessment, applications, portfolioUrl: `https://skillbridge.demo/portfolio/${userId}` }
}

// ---------------------------------------------------------------
// INDUSTRY
// ---------------------------------------------------------------

export async function apiGetIndustryProfile(userId) {
  await delay(150)
  return db.industryProfiles[userId] || null
}

export async function apiUpdateIndustryProfile(userId, updates) {
  await delay()
  db.industryProfiles[userId] = { ...db.industryProfiles[userId], ...updates }
  persist()
  return db.industryProfiles[userId]
}

export async function apiPostInternship(companyId, data) {
  await delay(500)
  const internship = { id: uid('int'), companyId, status: 'open', ...data }
  db.internships.unshift(internship)
  persist()
  return internship
}

export async function apiPostJob(companyId, data) {
  await delay(500)
  const job = { id: uid('job'), companyId, ...data }
  db.jobs.unshift(job)
  persist()
  return job
}

export async function apiGetCompanyOpportunities(companyId) {
  await delay(250)
  return {
    internships: db.internships.filter(i => i.companyId === companyId),
    jobs: db.jobs.filter(j => j.companyId === companyId)
  }
}

export async function apiGetCandidatesForOpportunity(oppId, type) {
  await delay(500)
  const opp = type === 'internship' ? db.internships.find(i => i.id === oppId) : db.jobs.find(j => j.id === oppId)
  if (!opp) return []
  const applicants = db.applications.filter(a => a.refId === oppId && a.type === type)
  const applicantIds = new Set(applicants.map(a => a.studentId))

  const candidates = Object.values(db.studentProfiles).map(profile => {
    const match = computeMatch(profile, opp)
    const user = db.users.find(u => u.id === profile.userId)
    const application = applicants.find(a => a.studentId === profile.userId)
    return {
      studentId: profile.userId,
      name: user?.name,
      college: profile.college,
      branch: profile.branch,
      cgpa: profile.cgpa,
      location: profile.location,
      skillReadiness: profile.skillReadiness,
      applied: applicantIds.has(profile.userId),
      applicationStatus: application?.status || null,
      applicationId: application?.id || null,
      ...match
    }
  })
  return candidates.sort((a, b) => b.matchPercent - a.matchPercent)
}

export async function apiGetAllApplicationsForCompany(companyId) {
  await delay(300)
  const oppIds = new Set([
    ...db.internships.filter(i => i.companyId === companyId).map(i => i.id),
    ...db.jobs.filter(j => j.companyId === companyId).map(j => j.id)
  ])
  return db.applications
    .filter(a => oppIds.has(a.refId))
    .map(a => {
      const opp = a.type === 'internship' ? db.internships.find(i => i.id === a.refId) : db.jobs.find(j => j.id === a.refId)
      const student = db.studentProfiles[a.studentId]
      const user = db.users.find(u => u.id === a.studentId)
      return { ...a, title: opp?.title, studentName: user?.name, college: student?.college }
    })
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
}

export async function apiUpdateApplicationStatus(applicationId, status) {
  await delay(400)
  const app = db.applications.find(a => a.id === applicationId)
  if (!app) throw new Error('Application not found.')
  app.status = status
  app.timeline = buildTimeline(status)
  db.notifications.push({ id: uid('ntf'), userId: app.studentId, text: `Your application status changed to "${status}".`, read: false, createdAt: new Date().toISOString() })
  persist()
  return app
}

export async function apiBulkShortlist(applicationIds) {
  await delay(500)
  applicationIds.forEach(id => {
    const app = db.applications.find(a => a.id === id)
    if (app) {
      app.status = 'Shortlisted'
      app.timeline = buildTimeline('Shortlisted')
      db.notifications.push({ id: uid('ntf'), userId: app.studentId, text: 'You have been shortlisted for an opportunity!', read: false, createdAt: new Date().toISOString() })
    }
  })
  persist()
  return true
}

export async function apiShortlistCandidateDirect(companyId, studentId, oppId, type) {
  await delay(400)
  let app = db.applications.find(a => a.studentId === studentId && a.refId === oppId && a.type === type)
  if (!app) {
    app = { id: uid('app'), studentId, type, refId: oppId, status: 'Shortlisted', appliedAt: new Date().toISOString(), timeline: buildTimeline('Shortlisted') }
    db.applications.push(app)
  } else {
    app.status = 'Shortlisted'
    app.timeline = buildTimeline('Shortlisted')
  }
  db.notifications.push({ id: uid('ntf'), userId: studentId, text: 'You have been shortlisted by a company via AI matching!', read: false, createdAt: new Date().toISOString() })
  persist()
  return app
}

// ---------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------

export async function apiGetAllStudents() {
  await delay(300)
  return Object.values(db.studentProfiles).map(p => {
    const user = db.users.find(u => u.id === p.userId)
    return { ...p, name: user?.name, email: user?.email }
  })
}

export async function apiGetAllIndustries() {
  await delay(300)
  return Object.values(db.industryProfiles).map(p => {
    const user = db.users.find(u => u.id === p.userId)
    const internshipCount = db.internships.filter(i => i.companyId === p.userId).length
    const jobCount = db.jobs.filter(j => j.companyId === p.userId).length
    return { ...p, email: user?.email, internshipCount, jobCount }
  })
}

export async function apiVerifyIndustry(companyId, approve) {
  await delay(400)
  if (db.industryProfiles[companyId]) {
    db.industryProfiles[companyId].verified = approve
  }
  db.verificationRequests = db.verificationRequests.filter(v => !(v.type === 'industry' && v.refId === companyId))
  db.notifications.push({ id: uid('ntf'), userId: companyId, text: approve ? 'Your company has been verified by the institution.' : 'Your verification request was declined.', read: false, createdAt: new Date().toISOString() })
  persist()
  return db.industryProfiles[companyId]
}

export async function apiVerifyCertificate(certId, studentId, approve) {
  await delay(400)
  const certs = db.certificates[studentId] || []
  const cert = certs.find(c => c.id === certId)
  if (cert) cert.verified = approve
  db.verificationRequests = db.verificationRequests.filter(v => v.refId !== certId)
  db.notifications.push({ id: uid('ntf'), userId: studentId, text: approve ? `Your certificate "${cert?.name}" has been verified.` : `Your certificate "${cert?.name}" verification was declined.`, read: false, createdAt: new Date().toISOString() })
  persist()
  return cert
}

export async function apiGetVerificationRequests() {
  await delay(250)
  return db.verificationRequests
}

export async function apiGetAdminAnalytics() {
  await delay(400)
  const students = Object.values(db.studentProfiles)
  const industries = Object.values(db.industryProfiles)
  const totalStudents = students.length
  const registeredIndustries = industries.length
  const activeInternships = db.internships.filter(i => i.status === 'open').length
  const activeJobs = db.jobs.length
  const placements = db.applications.filter(a => a.status === 'Selected').length
  const facultyCollaborations = db.collaborations.length

  const skillReadinessBuckets = { '0-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 }
  students.forEach(s => {
    const r = s.skillReadiness || 0
    if (r <= 40) skillReadinessBuckets['0-40']++
    else if (r <= 60) skillReadinessBuckets['41-60']++
    else if (r <= 80) skillReadinessBuckets['61-80']++
    else skillReadinessBuckets['81-100']++
  })

  const skillDemand = {}
  ;[...db.internships, ...db.jobs].forEach(o => {
    o.requiredSkills.forEach(s => { skillDemand[s] = (skillDemand[s] || 0) + 1 })
  })
  const topSkills = Object.entries(skillDemand).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([skill, count]) => ({ skill, count }))

  const funnel = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'].map(status => ({
    status, count: db.applications.filter(a => a.status === status).length
  }))

  const departmentHeatmap = ['Computer Science', 'Information Technology', 'Electronics'].map(dept => {
    const deptStudents = students.filter(s => s.branch === dept)
    const avg = (skill) => {
      const vals = deptStudents.map(s => (s.technicalSkills || []).find(t => t.name === skill)?.level).filter(v => v !== undefined)
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
    }
    return { department: dept, React: avg('React'), Python: avg('Python'), 'Cloud (AWS)': avg('Cloud (AWS)'), 'Machine Learning': avg('Machine Learning') }
  })

  return {
    totalStudents, registeredIndustries, activeInternships, activeJobs, placements, facultyCollaborations,
    skillReadinessBuckets, topSkills, funnel, departmentHeatmap,
    internshipParticipation: db.applications.filter(a => a.type === 'internship').length,
    placementPercentage: totalStudents ? Math.round((placements / totalStudents) * 100) : 0
  }
}

export async function apiGetFacultyOpportunities() {
  await delay(200)
  return db.facultyOpportunities.map(f => ({ ...f, company: db.industryProfiles[f.companyId]?.companyName }))
}

export async function apiGetCollaborations() {
  await delay(200)
  return db.collaborations.map(c => ({ ...c, company: db.industryProfiles[c.companyId]?.companyName }))
}

// ---------------------------------------------------------------
// NOTIFICATIONS & MESSAGES
// ---------------------------------------------------------------

export async function apiGetNotifications(userId) {
  await delay(150)
  return db.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function apiMarkNotificationRead(id) {
  await delay(100)
  const n = db.notifications.find(n => n.id === id)
  if (n) n.read = true
  persist()
  return true
}

export async function apiMarkAllNotificationsRead(userId) {
  await delay(150)
  db.notifications.filter(n => n.userId === userId).forEach(n => { n.read = true })
  persist()
  return true
}

export async function apiGetConversations(userId) {
  await delay(200)
  const partnersIds = new Set()
  db.messages.forEach(m => {
    if (m.from === userId) partnersIds.add(m.to)
    if (m.to === userId) partnersIds.add(m.from)
  })
  return [...partnersIds].map(pid => {
    const user = db.users.find(u => u.id === pid)
    const thread = db.messages.filter(m => (m.from === userId && m.to === pid) || (m.from === pid && m.to === userId))
      .sort((a, b) => new Date(a.at) - new Date(b.at))
    const last = thread[thread.length - 1]
    const unread = thread.filter(m => m.to === userId && !m.read).length
    return { partnerId: pid, partnerName: user?.name, lastMessage: last?.text, lastAt: last?.at, unread }
  }).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt))
}

export async function apiGetThread(userId, partnerId) {
  await delay(150)
  return db.messages.filter(m => (m.from === userId && m.to === partnerId) || (m.from === partnerId && m.to === userId))
    .sort((a, b) => new Date(a.at) - new Date(b.at))
}

export async function apiSendMessage(from, to, text) {
  await delay(200)
  const msg = { id: uid('msg'), from, to, text, at: new Date().toISOString(), read: false }
  db.messages.push(msg)
  db.notifications.push({ id: uid('ntf'), userId: to, text: `New message from ${db.users.find(u => u.id === from)?.name}.`, read: false, createdAt: new Date().toISOString() })
  persist()
  return msg
}

export async function apiListMessagablePeople(role) {
  await delay(150)
  if (role === 'student') return db.users.filter(u => u.role === 'industry')
  if (role === 'industry') return db.users.filter(u => u.role === 'student' || u.role === 'admin')
  return db.users.filter(u => u.role !== 'admin')
}

export function resetDemoData() {
  localStorage.removeItem(DB_KEY)
  db = loadDB()
}
