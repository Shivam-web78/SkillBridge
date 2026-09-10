const mongoose = require('mongoose')

const learningProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
}, { timestamps: true })

learningProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true })

module.exports = mongoose.model('LearningProgress', learningProgressSchema)
