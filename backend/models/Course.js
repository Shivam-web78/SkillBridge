const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, default: '' },
  duration: { type: String, default: '' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  skill: { type: String, required: true },
  certificate: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)
