const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 0 }
}, { _id: false })

const projectSchema = new mongoose.Schema({
  title: String,
  desc: String,
  tech: [String]
}, { _id: false })

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },
  year: { type: String, default: '' },
  cgpa: { type: Number, default: null },
  location: { type: String, default: '' },
  phone: { type: String, default: '' },
  careerInterests: [String],
  preferredRoles: [String],
  technicalSkills: [skillSchema],
  softSkills: [skillSchema],
  projects: [projectSchema],
  certifications: [String],
  achievements: [String],
  resumeFileName: { type: String, default: '' },
  profileCompletion: { type: Number, default: 15 },
  skillReadiness: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('StudentProfile', studentProfileSchema)
