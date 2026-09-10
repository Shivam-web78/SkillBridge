// Populates MongoDB with the same three demo accounts and a similar
// spread of sample data as src/services/seedData.js, so the backend
// behaves like the frontend mock on first run. Run with: npm run seed

require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')

const User = require('./models/User')
const StudentProfile = require('./models/StudentProfile')
const IndustryProfile = require('./models/IndustryProfile')
const Internship = require('./models/Internship')
const Job = require('./models/Job')
const Course = require('./models/Course')
const { FacultyOpportunity, Collaboration } = require('./models/Collaboration')

async function seed() {
  await connectDB()
  console.log('Clearing existing data...')
  await Promise.all([
    User.deleteMany({}), StudentProfile.deleteMany({}), IndustryProfile.deleteMany({}),
    Internship.deleteMany({}), Job.deleteMany({}), Course.deleteMany({}),
    FacultyOpportunity.deleteMany({}), Collaboration.deleteMany({})
  ])

  console.log('Creating demo accounts...')
  const student = await User.create({ name: 'Rahul Sharma', email: 'rahul@skillbridge.demo', password: 'demo1234', role: 'student' })
  const industry = await User.create({ name: 'TechNova HR', email: 'hr@technova.demo', password: 'demo1234', role: 'industry' })
  const admin = await User.create({ name: 'Platform Admin', email: 'admin@skillbridge.demo', password: 'demo1234', role: 'admin' })

  await StudentProfile.create({
    userId: student._id,
    college: 'IIT Delhi', degree: 'B.Tech', branch: 'Computer Science', year: '3rd Year', cgpa: 8.4,
    location: 'New Delhi', careerInterests: ['Full Stack Development', 'Cloud Computing'],
    preferredRoles: ['Frontend Developer', 'Full Stack Developer'],
    technicalSkills: [
      { name: 'React', level: 78 }, { name: 'JavaScript', level: 82 }, { name: 'Node.js', level: 55 },
      { name: 'MongoDB', level: 48 }, { name: 'Python', level: 60 }
    ],
    softSkills: [{ name: 'Communication', level: 70 }, { name: 'Teamwork', level: 75 }],
    projects: [{ title: 'Campus Event Portal', desc: 'MERN stack event management system for college fests.', tech: ['React', 'Node.js', 'MongoDB'] }],
    certifications: ['freeCodeCamp Responsive Web Design'],
    profileCompletion: 72, skillReadiness: 68
  })

  await IndustryProfile.create({
    userId: industry._id, companyName: 'TechNova Solutions', industry: 'Software Services',
    location: 'Bengaluru', size: '500-1000', verified: true,
    about: 'A fast-growing software services company building products for fintech and e-commerce clients.'
  })

  console.log('Creating sample internships and jobs...')
  const internship = await Internship.create({
    companyId: industry._id, title: 'Frontend Developer Intern',
    description: 'Work on our customer-facing React dashboard alongside senior engineers.',
    requiredSkills: ['React', 'JavaScript', 'REST APIs'], softSkills: ['Communication', 'Teamwork'],
    eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 7, location: 'Bengaluru', remote: true,
    duration: '6 months', stipend: 25000, positions: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: 'open'
  })

  await Job.create({
    companyId: industry._id, title: 'Junior Full Stack Engineer',
    description: 'Join our product team building scalable web applications end to end.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs'], qualifications: 'B.Tech in CS/IT',
    experience: '0-2 years', salary: '8-12 LPA', location: 'Bengaluru', jobType: 'Full-time',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  })

  console.log('Creating course catalog...')
  await Course.insertMany([
    { title: 'Advanced Node.js & Express', provider: 'SkillBridge Learning', duration: '4 weeks', difficulty: 'Intermediate', skill: 'Node.js', certificate: true },
    { title: 'MongoDB for Developers', provider: 'SkillBridge Learning', duration: '3 weeks', difficulty: 'Beginner', skill: 'MongoDB', certificate: true },
    { title: 'System Design Fundamentals', provider: 'SkillBridge Learning', duration: '6 weeks', difficulty: 'Advanced', skill: 'System Design', certificate: true },
    { title: 'AWS Cloud Practitioner Path', provider: 'SkillBridge Learning', duration: '5 weeks', difficulty: 'Beginner', skill: 'Cloud (AWS)', certificate: true }
  ])

  console.log('Creating faculty opportunity and collaboration...')
  await FacultyOpportunity.create({
    companyId: industry._id, type: 'Research Collaboration', title: 'Applied ML for Fraud Detection',
    description: 'Joint research initiative on fraud detection models for fintech transactions.',
    duration: '6 months', mode: 'Hybrid'
  })
  await Collaboration.create({
    companyId: industry._id, type: 'Guest Lecture', title: 'Modern Frontend Architecture',
    description: 'A guest lecture series on component-driven frontend architecture for final-year students.',
    status: 'open'
  })

  console.log('\nSeed complete. Demo credentials (password: demo1234 for all):')
  console.log('  Student:  rahul@skillbridge.demo')
  console.log('  Industry: hr@technova.demo')
  console.log('  Admin:    admin@skillbridge.demo')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
