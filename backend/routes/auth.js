const express = require('express')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const StudentProfile = require('../models/StudentProfile')
const IndustryProfile = require('../models/IndustryProfile')

const router = express.Router()

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Demo account emails seeded by backend/seed.js, keyed by role -
// mirrors demoAccountIds in src/services/seedData.js.
const DEMO_EMAILS = {
  student: 'rahul@skillbridge.demo',
  industry: 'hr@technova.demo',
  admin: 'admin@skillbridge.demo'
}

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['student', 'industry', 'admin'])
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })

  const { name, email, password, role } = req.body
  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) return res.status(409).json({ message: 'An account with this email already exists.' })

  const user = await User.create({ name, email, password, role })

  if (role === 'student') {
    await StudentProfile.create({ userId: user._id, profileCompletion: 15, skillReadiness: 0 })
  }
  if (role === 'industry') {
    await IndustryProfile.create({ userId: user._id, companyName: name, verified: false })
  }

  const token = signToken(user)
  res.status(201).json({ user: user.toSafeObject(), token })
})

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  body('role').isIn(['student', 'industry', 'admin'])
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })

  const { email, password, role } = req.body
  const user = await User.findOne({ email: email.toLowerCase(), role }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials. Check your email, password and selected role.' })
  }

  const token = signToken(user)
  res.json({ user: user.toSafeObject(), token })
})

// POST /api/auth/demo-login  { role: 'student' | 'industry' | 'admin' }
router.post('/demo-login', [body('role').isIn(['student', 'industry', 'admin'])], async (req, res) => {
  const { role } = req.body
  const user = await User.findOne({ email: DEMO_EMAILS[role] })
  if (!user) return res.status(404).json({ message: 'Demo account not seeded. Run npm run seed first.' })

  const token = signToken(user)
  res.json({ user: user.toSafeObject(), token })
})

// POST /api/auth/reset-password
router.post('/reset-password', [
  body('email').isEmail(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })

  const { email, newPassword } = req.body
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(404).json({ message: 'No account found with that email.' })

  user.password = newPassword
  await user.save()
  res.json({ success: true })
})

module.exports = router
