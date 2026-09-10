const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verifies the Bearer token and attaches the authenticated user to req.user.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'No token provided.' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'User no longer exists.' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// Restricts a route to one or more roles, e.g. requireRole('admin')
// or requireRole('industry', 'admin'). Must run after requireAuth.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have access to this resource.' })
    }
    next()
  }
}

module.exports = { requireAuth, requireRole }
