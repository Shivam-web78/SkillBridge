const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  requiredSkills: [String],
  qualifications: { type: String, default: '' },
  experience: { type: String, default: '' },
  salary: { type: String, default: '' },
  location: { type: String, default: '' },
  jobType: { type: String, enum: ['Full-time', 'Contract', 'Remote'], default: 'Full-time' },
  deadline: { type: Date },
  archived: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Job', jobSchema)
