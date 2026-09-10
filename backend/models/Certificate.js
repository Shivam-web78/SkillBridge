const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issuedDate: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  credentialId: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Certificate', certificateSchema)
