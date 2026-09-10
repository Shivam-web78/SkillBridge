const mongoose = require('mongoose')

const verificationRequestSchema = new mongoose.Schema({
  type: { type: String, enum: ['industry', 'certificate'], required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
}, { timestamps: { createdAt: 'submittedAt', updatedAt: true } })

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema)
