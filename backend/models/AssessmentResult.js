const mongoose = require('mongoose')

const assessmentResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  overallScore: { type: Number, required: true },
  breakdown: { type: Map, of: Number },
  strengths: [String],
  gaps: [String],
  recommendedSkills: [String],
  recommendedRoles: [String]
}, { timestamps: { createdAt: 'completedAt', updatedAt: true } })

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema)
