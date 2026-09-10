const express = require('express')
const Message = require('../models/Message')
const Notification = require('../models/Notification')
const User = require('../models/User')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.use(requireAuth)

// GET /api/shared/conversations
router.get('/conversations', async (req, res) => {
  const messages = await Message.find({ $or: [{ from: req.user._id }, { to: req.user._id }] }).sort({ at: -1 })

  const partnerIds = new Set()
  messages.forEach((m) => {
    partnerIds.add(String(m.from) === String(req.user._id) ? String(m.to) : String(m.from))
  })

  const partners = await User.find({ _id: { $in: [...partnerIds] } })
  const partnerMap = {}
  partners.forEach((p) => { partnerMap[p._id] = p })

  const conversations = [...partnerIds].map((partnerId) => {
    const thread = messages.filter((m) => String(m.from) === partnerId || String(m.to) === partnerId)
    const last = thread[0]
    const unread = thread.filter((m) => String(m.to) === String(req.user._id) && !m.read).length
    return {
      partnerId,
      partnerName: partnerMap[partnerId]?.name,
      lastMessage: last?.text,
      unread
    }
  })

  res.json(conversations)
})

// GET /api/shared/thread/:partnerId
router.get('/thread/:partnerId', async (req, res) => {
  const { partnerId } = req.params
  const thread = await Message.find({
    $or: [
      { from: req.user._id, to: partnerId },
      { from: partnerId, to: req.user._id }
    ]
  }).sort({ at: 1 })

  await Message.updateMany({ from: partnerId, to: req.user._id, read: false }, { read: true })
  res.json(thread)
})

// POST /api/shared/messages  { to, text }
router.post('/messages', async (req, res) => {
  const { to, text } = req.body
  const message = await Message.create({ from: req.user._id, to, text })
  res.status(201).json(message)
})

// GET /api/shared/messagable-people?role=student|industry
router.get('/messagable-people', async (req, res) => {
  const { role } = req.query
  const targetRole = role === 'student' ? 'industry' : role === 'industry' ? 'student' : null
  const query = targetRole ? { role: targetRole } : { _id: { $ne: req.user._id } }
  const people = await User.find(query, 'name role')
  res.json(people)
})

// GET /api/shared/notifications
router.get('/notifications', async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50)
  res.json(notifications)
})

// PUT /api/shared/notifications/:id/read
router.put('/notifications/:id/read', async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  )
  res.json(notification)
})

// PUT /api/shared/notifications/read-all
router.put('/notifications/read-all', async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true })
  res.json({ success: true })
})

module.exports = router
