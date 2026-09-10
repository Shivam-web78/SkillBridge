const mongoose = require('mongoose')

const internshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  requiredSkills: [String],
  softSkills: [String],
  eligibility: { type: String, default: '' },
  branch: { type: String, default: '' },
  minCgpa: { type: Number, default: 0 },
  location: { type: String, default: '' },
  remote: { type: Boolean, default: false },
  duration: { type: String, default: '' },
  stipend: { type: Number, default: 0 },
  positions: { type: Number, default: 1 },
  deadline: { type: Date },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true })

module.exports = mongoose.model('Internship', internshipSchema)
