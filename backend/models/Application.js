const mongoose = require('mongoose')

const timelineEntrySchema = new mongoose.Schema({
  status: String,
  at: { type: Date, default: Date.now }
}, { _id: false })

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['internship', 'job'], required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'refModel' },
  refModel: { type: String, enum: ['Internship', 'Job'], required: true },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  timeline: [timelineEntrySchema]
}, { timestamps: { createdAt: 'appliedAt', updatedAt: true } })

applicationSchema.index({ studentId: 1, refId: 1, type: 1 }, { unique: true })

module.exports = mongoose.model('Application', applicationSchema)
