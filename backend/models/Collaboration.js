const mongoose = require('mongoose')

const facultyOpportunitySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, default: '' },
  mode: { type: String, enum: ['On-campus', 'On-site', 'Remote', 'Hybrid'], default: 'Remote' }
}, { timestamps: true })

const collaborationSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true })

module.exports = {
  FacultyOpportunity: mongoose.model('FacultyOpportunity', facultyOpportunitySchema),
  Collaboration: mongoose.model('Collaboration', collaborationSchema)
}
