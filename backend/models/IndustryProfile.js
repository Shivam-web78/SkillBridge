const mongoose = require('mongoose')

const industryProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  industry: { type: String, default: '' },
  location: { type: String, default: '' },
  size: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  about: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('IndustryProfile', industryProfileSchema)
