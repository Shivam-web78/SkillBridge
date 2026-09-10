// Realistic seed/demo data for the SkillBridge prototype.
// This stands in for MongoDB documents. Shapes mirror the Mongoose
// schemas in /backend/models so swapping in a real API later is a
// matter of pointing services/mockApi.js at real HTTP calls.

export const skillCatalog = [
  'React', 'JavaScript', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS',
  'Python', 'Java', 'System Design', 'REST APIs', 'SQL', 'Cloud (AWS)',
  'Docker', 'Machine Learning', 'Data Structures', 'Git', 'TypeScript',
  'Communication', 'Problem Solving', 'Teamwork'
]

export const seedUsers = [
  { id: 'u-stu-1', role: 'student', name: 'Rahul Sharma', email: 'rahul@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-2', role: 'student', name: 'Priya Nair', email: 'priya@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-3', role: 'student', name: 'Aman Verma', email: 'aman@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-4', role: 'student', name: 'Sneha Iyer', email: 'sneha@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-5', role: 'student', name: 'Karan Mehta', email: 'karan@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-6', role: 'student', name: 'Ananya Das', email: 'ananya@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-7', role: 'student', name: 'Vikram Singh', email: 'vikram@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-8', role: 'student', name: 'Ishita Roy', email: 'ishita@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-9', role: 'student', name: 'Rohan Gupta', email: 'rohan@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-10', role: 'student', name: 'Divya Pillai', email: 'divya@skillbridge.demo', password: 'demo123' },
  { id: 'u-stu-11', role: 'student', name: 'Arjun Kumar', email: 'arjun@skillbridge.demo', password: 'demo123' },

  { id: 'u-ind-1', role: 'industry', name: 'TechNova Solutions', email: 'hr@technova.demo', password: 'demo123' },
  { id: 'u-ind-2', role: 'industry', name: 'CloudEdge Systems', email: 'hr@cloudedge.demo', password: 'demo123' },
  { id: 'u-ind-3', role: 'industry', name: 'FinPay Technologies', email: 'hr@finpay.demo', password: 'demo123' },
  { id: 'u-ind-4', role: 'industry', name: 'GreenGrid Energy', email: 'hr@greengrid.demo', password: 'demo123' },
  { id: 'u-ind-5', role: 'industry', name: 'DataSphere Analytics', email: 'hr@datasphere.demo', password: 'demo123' },

  { id: 'u-adm-1', role: 'admin', name: 'Dr. Meera Krishnan', email: 'admin@skillbridge.demo', password: 'demo123' }
]

export const demoAccountIds = {
  student: 'u-stu-1',
  industry: 'u-ind-1',
  admin: 'u-adm-1'
}

export const seedStudentProfiles = {
  'u-stu-1': {
    userId: 'u-stu-1', college: 'IIT Delhi', degree: 'B.Tech', branch: 'Computer Science', year: '3rd Year',
    cgpa: 8.4, location: 'Delhi', phone: '+91 98xxxxxx01',
    careerInterests: ['Full Stack Development', 'Cloud Computing'],
    preferredRoles: ['Frontend Developer', 'Full Stack Developer'],
    technicalSkills: [
      { name: 'React', level: 72 }, { name: 'JavaScript', level: 80 },
      { name: 'Node.js', level: 45 }, { name: 'MongoDB', level: 60 },
      { name: 'System Design', level: 30 }, { name: 'REST APIs', level: 55 }
    ],
    softSkills: [
      { name: 'Communication', level: 78 }, { name: 'Teamwork', level: 82 }, { name: 'Problem Solving', level: 70 }
    ],
    projects: [
      { title: 'Campus Event Manager', desc: 'MERN app for managing college events and RSVPs.', tech: ['React', 'Node.js', 'MongoDB'] },
      { title: 'Weather Dashboard', desc: 'React weather app consuming a public API with charting.', tech: ['React', 'Recharts'] }
    ],
    certifications: ['Meta Front-End Developer (Coursera)', 'freeCodeCamp JavaScript Algorithms'],
    achievements: ['Winner, college hackathon 2025', 'Open source contributor - 3 merged PRs'],
    resumeFileName: 'rahul_sharma_resume.pdf',
    profileCompletion: 85,
    skillReadiness: 72
  },
  'u-stu-2': {
    userId: 'u-stu-2', college: 'NIT Trichy', degree: 'B.Tech', branch: 'Information Technology', year: '4th Year',
    cgpa: 9.1, location: 'Chennai', phone: '+91 98xxxxxx02',
    careerInterests: ['Backend Development', 'System Design'],
    preferredRoles: ['Backend Developer', 'SDE'],
    technicalSkills: [
      { name: 'Node.js', level: 88 }, { name: 'Express.js', level: 85 }, { name: 'MongoDB', level: 80 },
      { name: 'System Design', level: 65 }, { name: 'Docker', level: 55 }, { name: 'REST APIs', level: 90 }
    ],
    softSkills: [{ name: 'Communication', level: 74 }, { name: 'Teamwork', level: 80 }, { name: 'Problem Solving', level: 91 }],
    projects: [{ title: 'Scalable URL Shortener', desc: 'High-throughput URL shortener with Redis caching.', tech: ['Node.js', 'Redis', 'MongoDB'] }],
    certifications: ['AWS Certified Cloud Practitioner'],
    achievements: ['Smart India Hackathon 2025 Finalist'],
    resumeFileName: 'priya_nair_resume.pdf',
    profileCompletion: 92,
    skillReadiness: 84
  },
  'u-stu-3': {
    userId: 'u-stu-3', college: 'BITS Pilani', degree: 'B.E.', branch: 'Computer Science', year: '2nd Year',
    cgpa: 7.6, location: 'Pilani', phone: '+91 98xxxxxx03',
    careerInterests: ['Data Science', 'AI/ML'],
    preferredRoles: ['ML Intern', 'Data Analyst'],
    technicalSkills: [
      { name: 'Python', level: 75 }, { name: 'Machine Learning', level: 50 }, { name: 'SQL', level: 60 },
      { name: 'React', level: 30 }, { name: 'Data Structures', level: 65 }
    ],
    softSkills: [{ name: 'Communication', level: 60 }, { name: 'Teamwork', level: 68 }, { name: 'Problem Solving', level: 72 }],
    projects: [{ title: 'Movie Recommendation Engine', desc: 'Collaborative filtering recommender in Python.', tech: ['Python', 'Pandas'] }],
    certifications: ['Andrew Ng ML Specialization (in progress)'],
    achievements: [],
    resumeFileName: 'aman_verma_resume.pdf',
    profileCompletion: 68,
    skillReadiness: 55
  }
}

// Generate lightweight profiles for the remaining seed students so
// matching/analytics have a full pool to work with.
const extraNames = ['Sneha Iyer', 'Karan Mehta', 'Ananya Das', 'Vikram Singh', 'Ishita Roy', 'Rohan Gupta', 'Divya Pillai', 'Arjun Kumar']
const colleges = ['VIT Vellore', 'Delhi Technological University', 'IIIT Hyderabad', 'Anna University', 'Manipal Institute of Technology', 'Jadavpur University', 'PES University', 'NSUT Delhi']
const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Computer Science']
extraNames.forEach((name, idx) => {
  const id = `u-stu-${idx + 4}`
  const base = 40 + Math.floor(Math.random() * 45)
  seedStudentProfiles[id] = {
    userId: id, college: colleges[idx % colleges.length], degree: 'B.Tech', branch: branches[idx % branches.length],
    year: `${(idx % 4) + 1}${['st', 'nd', 'rd', 'th'][idx % 4]} Year`, cgpa: +(6.8 + Math.random() * 2.5).toFixed(1),
    location: ['Bengaluru', 'Pune', 'Hyderabad', 'Mumbai', 'Chennai', 'Kolkata'][idx % 6],
    phone: `+91 98xxxxxx${10 + idx}`,
    careerInterests: ['Full Stack Development', 'Cloud Computing'],
    preferredRoles: ['Frontend Developer', 'Backend Developer'],
    technicalSkills: [
      { name: 'React', level: base }, { name: 'JavaScript', level: base + 10 },
      { name: 'Node.js', level: base - 15 < 0 ? 10 : base - 15 }, { name: 'MongoDB', level: base - 5 < 0 ? 10 : base - 5 },
      { name: 'System Design', level: base - 25 < 0 ? 10 : base - 25 }
    ],
    softSkills: [{ name: 'Communication', level: base }, { name: 'Teamwork', level: base + 5 }, { name: 'Problem Solving', level: base }],
    projects: [{ title: 'Portfolio Website', desc: 'Personal portfolio built to showcase projects.', tech: ['React', 'Tailwind CSS'] }],
    certifications: [],
    achievements: [],
    resumeFileName: `${name.split(' ')[0].toLowerCase()}_resume.pdf`,
    profileCompletion: 55 + Math.floor(Math.random() * 35),
    skillReadiness: base
  }
})

export const seedIndustryProfiles = {
  'u-ind-1': { userId: 'u-ind-1', companyName: 'TechNova Solutions', industry: 'Software Services', location: 'Bengaluru', size: '500-1000', verified: true, about: 'Full-stack product engineering company building SaaS tools for enterprises.' },
  'u-ind-2': { userId: 'u-ind-2', companyName: 'CloudEdge Systems', industry: 'Cloud Infrastructure', location: 'Hyderabad', size: '200-500', verified: true, about: 'Cloud-native infrastructure and DevOps tooling provider.' },
  'u-ind-3': { userId: 'u-ind-3', companyName: 'FinPay Technologies', industry: 'FinTech', location: 'Mumbai', size: '1000+', verified: true, about: 'Digital payments and lending platform serving Indian SMEs.' },
  'u-ind-4': { userId: 'u-ind-4', companyName: 'GreenGrid Energy', industry: 'CleanTech', location: 'Pune', size: '100-200', verified: false, about: 'Smart-grid analytics for renewable energy operators.' },
  'u-ind-5': { userId: 'u-ind-5', companyName: 'DataSphere Analytics', industry: 'Data & AI', location: 'Gurugram', size: '200-500', verified: true, about: 'ML-driven analytics platform for retail and logistics clients.' }
}

export const seedInternships = [
  { id: 'int-1', companyId: 'u-ind-1', title: 'Frontend Developer Intern', description: 'Build and ship features for our internal design system and customer dashboards using React and Tailwind CSS.', requiredSkills: ['React', 'JavaScript', 'Tailwind CSS'], softSkills: ['Communication', 'Teamwork'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 7.0, location: 'Bengaluru', remote: true, duration: '6 months', stipend: 25000, positions: 4, deadline: '2026-10-15', status: 'open' },
  { id: 'int-2', companyId: 'u-ind-1', title: 'Backend Developer Intern', description: 'Design REST APIs and data models for our billing microservice using Node.js and MongoDB.', requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'], softSkills: ['Problem Solving'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 7.5, location: 'Bengaluru', remote: false, duration: '6 months', stipend: 28000, positions: 3, deadline: '2026-10-20', status: 'open' },
  { id: 'int-3', companyId: 'u-ind-2', title: 'Cloud Engineering Intern', description: 'Work with our SRE team on Docker, CI/CD pipelines and observability tooling.', requiredSkills: ['Docker', 'Cloud (AWS)', 'System Design'], softSkills: ['Problem Solving'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT/ECE', minCgpa: 7.0, location: 'Hyderabad', remote: true, duration: '3 months', stipend: 20000, positions: 5, deadline: '2026-09-30', status: 'open' },
  { id: 'int-4', companyId: 'u-ind-3', title: 'Full Stack Intern - Payments', description: 'Contribute to our merchant dashboard used by 50,000+ small businesses.', requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs'], softSkills: ['Communication', 'Teamwork'], eligibility: 'B.Tech/B.E./M.Tech', branch: 'CS/IT', minCgpa: 7.2, location: 'Mumbai', remote: false, duration: '6 months', stipend: 30000, positions: 2, deadline: '2026-10-05', status: 'open' },
  { id: 'int-5', companyId: 'u-ind-4', title: 'IoT & Data Intern', description: 'Analyze smart-meter data streams to improve grid load forecasting.', requiredSkills: ['Python', 'SQL', 'Machine Learning'], softSkills: ['Problem Solving'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT/EE', minCgpa: 6.8, location: 'Pune', remote: true, duration: '4 months', stipend: 18000, positions: 3, deadline: '2026-09-25', status: 'open' },
  { id: 'int-6', companyId: 'u-ind-5', title: 'Data Analyst Intern', description: 'Build dashboards and predictive models for retail demand forecasting.', requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Data Structures'], softSkills: ['Communication'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 7.0, location: 'Gurugram', remote: true, duration: '6 months', stipend: 22000, positions: 4, deadline: '2026-10-10', status: 'open' },
  { id: 'int-7', companyId: 'u-ind-2', title: 'DevOps Intern', description: 'Automate deployment pipelines and infrastructure-as-code for client projects.', requiredSkills: ['Docker', 'Cloud (AWS)', 'Git'], softSkills: ['Teamwork'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 6.5, location: 'Hyderabad', remote: false, duration: '3 months', stipend: 19000, positions: 2, deadline: '2026-09-28', status: 'open' },
  { id: 'int-8', companyId: 'u-ind-1', title: 'QA & Test Automation Intern', description: 'Write automated test suites for our React front end and Node APIs.', requiredSkills: ['JavaScript', 'REST APIs', 'Git'], softSkills: ['Problem Solving'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 6.5, location: 'Bengaluru', remote: true, duration: '3 months', stipend: 16000, positions: 3, deadline: '2026-10-01', status: 'open' },
  { id: 'int-9', companyId: 'u-ind-3', title: 'Mobile App Intern (React Native)', description: 'Ship features for our merchant mobile app used across India.', requiredSkills: ['React', 'JavaScript'], softSkills: ['Teamwork'], eligibility: 'B.Tech/B.E.', branch: 'CS/IT', minCgpa: 6.8, location: 'Mumbai', remote: true, duration: '5 months', stipend: 21000, positions: 2, deadline: '2026-10-12', status: 'open' },
  { id: 'int-10', companyId: 'u-ind-5', title: 'ML Research Intern', description: 'Prototype recommendation models with our applied research team.', requiredSkills: ['Python', 'Machine Learning', 'Data Structures'], softSkills: ['Problem Solving'], eligibility: 'B.Tech/M.Tech', branch: 'CS/IT', minCgpa: 7.8, location: 'Gurugram', remote: false, duration: '6 months', stipend: 27000, positions: 2, deadline: '2026-10-18', status: 'open' }
]

export const seedJobs = [
  { id: 'job-1', companyId: 'u-ind-1', title: 'Frontend Developer', description: 'Own the front-end architecture for our flagship SaaS product.', requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'], qualifications: 'B.Tech in CS/IT', experience: '0-2 years', salary: '6-9 LPA', location: 'Bengaluru', jobType: 'Full-time', deadline: '2026-11-01' },
  { id: 'job-2', companyId: 'u-ind-1', title: 'Backend Developer (Node.js)', description: 'Build and scale backend services for millions of monthly users.', requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'System Design'], qualifications: 'B.Tech in CS/IT', experience: '1-3 years', salary: '8-12 LPA', location: 'Bengaluru', jobType: 'Full-time', deadline: '2026-11-05' },
  { id: 'job-3', companyId: 'u-ind-2', title: 'Cloud Engineer', description: 'Design resilient cloud infrastructure for enterprise clients.', requiredSkills: ['Cloud (AWS)', 'Docker', 'System Design'], qualifications: 'B.Tech in CS/IT/ECE', experience: '1-3 years', salary: '9-13 LPA', location: 'Hyderabad', jobType: 'Full-time', deadline: '2026-11-10' },
  { id: 'job-4', companyId: 'u-ind-3', title: 'Full Stack Engineer', description: 'Work across our React front end and Node.js services for payments.', requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs'], qualifications: 'B.Tech/M.Tech in CS/IT', experience: '0-2 years', salary: '7-11 LPA', location: 'Mumbai', jobType: 'Full-time', deadline: '2026-11-08' },
  { id: 'job-5', companyId: 'u-ind-5', title: 'Data Analyst', description: 'Turn retail data into actionable insights for our clients.', requiredSkills: ['Python', 'SQL', 'Machine Learning'], qualifications: 'B.Tech/B.Sc in CS/Stats', experience: '0-2 years', salary: '6-8 LPA', location: 'Gurugram', jobType: 'Full-time', deadline: '2026-11-03' },
  { id: 'job-6', companyId: 'u-ind-4', title: 'Software Engineer - IoT', description: 'Build data pipelines for smart-grid telemetry.', requiredSkills: ['Python', 'SQL', 'Data Structures'], qualifications: 'B.Tech in CS/EE', experience: '0-2 years', salary: '6-9 LPA', location: 'Pune', jobType: 'Full-time', deadline: '2026-10-30' },
  { id: 'job-7', companyId: 'u-ind-2', title: 'DevOps Engineer', description: 'Own CI/CD and observability across client environments.', requiredSkills: ['Docker', 'Cloud (AWS)', 'Git'], qualifications: 'B.Tech in CS/IT', experience: '1-4 years', salary: '9-14 LPA', location: 'Hyderabad', jobType: 'Full-time', deadline: '2026-11-12' },
  { id: 'job-8', companyId: 'u-ind-3', title: 'QA Engineer', description: 'Lead test automation strategy for our merchant platform.', requiredSkills: ['JavaScript', 'REST APIs'], qualifications: 'B.Tech in CS/IT', experience: '0-2 years', salary: '5-7 LPA', location: 'Mumbai', jobType: 'Full-time', deadline: '2026-10-25' },
  { id: 'job-9', companyId: 'u-ind-5', title: 'Machine Learning Engineer', description: 'Take ML prototypes to production-grade services.', requiredSkills: ['Python', 'Machine Learning', 'System Design'], qualifications: 'B.Tech/M.Tech in CS', experience: '1-3 years', salary: '10-16 LPA', location: 'Gurugram', jobType: 'Full-time', deadline: '2026-11-15' },
  { id: 'job-10', companyId: 'u-ind-1', title: 'Product Support Engineer', description: 'Bridge customers and engineering for our SaaS platform.', requiredSkills: ['REST APIs', 'Communication', 'SQL'], qualifications: 'B.Tech in any branch', experience: '0-1 years', salary: '4-6 LPA', location: 'Bengaluru', jobType: 'Full-time', deadline: '2026-10-28' }
]

export const seedCourses = [
  { id: 'c-1', title: 'Node.js Fundamentals', provider: 'Coursera', duration: '4 weeks', difficulty: 'Beginner', skill: 'Node.js', certificate: true },
  { id: 'c-2', title: 'Building REST APIs with Express', provider: 'Udemy', duration: '3 weeks', difficulty: 'Intermediate', skill: 'REST APIs', certificate: true },
  { id: 'c-3', title: 'Authentication & Security in Node', provider: 'Udemy', duration: '2 weeks', difficulty: 'Intermediate', skill: 'Node.js', certificate: true },
  { id: 'c-4', title: 'Full-Stack MERN Project', provider: 'freeCodeCamp', duration: '6 weeks', difficulty: 'Advanced', skill: 'MongoDB', certificate: false },
  { id: 'c-5', title: 'System Design Primer', provider: 'Educative', duration: '5 weeks', difficulty: 'Advanced', skill: 'System Design', certificate: true },
  { id: 'c-6', title: 'AWS Cloud Practitioner Prep', provider: 'AWS Skill Builder', duration: '3 weeks', difficulty: 'Beginner', skill: 'Cloud (AWS)', certificate: true },
  { id: 'c-7', title: 'Docker & Containers Crash Course', provider: 'Udemy', duration: '2 weeks', difficulty: 'Beginner', skill: 'Docker', certificate: true },
  { id: 'c-8', title: 'Python for Data Analysis', provider: 'Coursera', duration: '5 weeks', difficulty: 'Beginner', skill: 'Python', certificate: true },
  { id: 'c-9', title: 'Machine Learning Specialization', provider: 'Coursera (Andrew Ng)', duration: '10 weeks', difficulty: 'Advanced', skill: 'Machine Learning', certificate: true },
  { id: 'c-10', title: 'SQL for Everybody', provider: 'Coursera', duration: '3 weeks', difficulty: 'Beginner', skill: 'SQL', certificate: true }
]

export const seedFacultyOpportunities = [
  { id: 'fac-1', companyId: 'u-ind-1', type: 'Guest Lecture', title: 'Modern Frontend Architecture', description: 'A guest lecture series on scalable React architecture for final-year students.', duration: '1 day', mode: 'On-campus' },
  { id: 'fac-2', companyId: 'u-ind-2', type: 'FDP', title: 'Cloud-Native Systems FDP', description: 'A week-long faculty development program on containerization and cloud infra.', duration: '5 days', mode: 'Hybrid' },
  { id: 'fac-3', companyId: 'u-ind-3', type: 'Industrial Training', title: 'FinTech Systems Immersion', description: 'A two-week industrial training placement for faculty in payments engineering.', duration: '2 weeks', mode: 'On-site' },
  { id: 'fac-4', companyId: 'u-ind-5', type: 'Research Collaboration', title: 'Applied ML for Retail Forecasting', description: 'Joint research project on demand forecasting models with publication support.', duration: '6 months', mode: 'Remote' },
  { id: 'fac-5', companyId: 'u-ind-4', type: 'Consultancy', title: 'Smart Grid Data Consultancy', description: 'Paid consultancy engagement analyzing smart-meter datasets.', duration: '3 months', mode: 'Remote' }
]

export const seedCollaborations = [
  { id: 'col-1', companyId: 'u-ind-1', type: 'Live Project', title: 'Design System Overhaul', description: 'Students/faculty collaborate on rebuilding our internal component library.', status: 'open' },
  { id: 'col-2', companyId: 'u-ind-3', type: 'Innovation Challenge', title: 'FinTech for Bharat Hackathon', description: 'A 48-hour challenge to design financial inclusion products for tier-2/3 India.', status: 'open' },
  { id: 'col-3', companyId: 'u-ind-5', type: 'Research Project', title: 'Explainable AI for Retail', description: 'Research collaboration on interpretable ML models for demand planning.', status: 'open' },
  { id: 'col-4', companyId: 'u-ind-2', type: 'Mentorship Program', title: 'Cloud Careers Mentorship', description: 'Monthly mentorship cohort pairing engineers with students exploring cloud roles.', status: 'open' },
  { id: 'col-5', companyId: 'u-ind-4', type: 'Consultancy Project', title: 'Renewable Load Forecasting', description: 'Consultancy engagement to improve grid load prediction accuracy.', status: 'open' }
]

export const assessmentBank = {
  technical: [
    { id: 't1', text: 'What does REST stand for in API design?', difficulty: 'easy', options: ['Representational State Transfer', 'Remote Execution State Transfer', 'Rapid State Transfer', 'Representational Storage Transfer'], answer: 0 },
    { id: 't2', text: 'Which HTTP method is idempotent?', difficulty: 'easy', options: ['POST', 'PUT', 'PATCH (partial)', 'CONNECT'], answer: 1 },
    { id: 't3', text: 'In React, what hook is used to manage local component state?', difficulty: 'easy', options: ['useEffect', 'useState', 'useMemo', 'useRef'], answer: 1 },
    { id: 't4', text: 'What is the time complexity of binary search on a sorted array?', difficulty: 'medium', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answer: 2 },
    { id: 't5', text: 'Which MongoDB operator is used to update a field?', difficulty: 'medium', options: ['$push', '$set', '$match', '$group'], answer: 1 },
    { id: 't6', text: 'What does JWT stand for?', difficulty: 'medium', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Web Transfer', 'Joint Web Token'], answer: 1 },
    { id: 't7', text: 'In a microservices architecture, what pattern helps prevent cascading failures?', difficulty: 'hard', options: ['Singleton pattern', 'Circuit breaker pattern', 'Observer pattern', 'Factory pattern'], answer: 1 },
    { id: 't8', text: 'Which consistency model does MongoDB provide by default for single-document operations?', difficulty: 'hard', options: ['Eventual consistency', 'Strong consistency', 'Causal consistency only', 'No consistency guarantee'], answer: 1 },
    { id: 't9', text: 'What is the purpose of database indexing?', difficulty: 'medium', options: ['To encrypt data', 'To speed up query performance', 'To reduce storage size', 'To back up data'], answer: 1 },
    { id: 't10', text: 'Which design principle does dependency injection primarily support?', difficulty: 'hard', options: ['Tight coupling', 'Inversion of control', 'Global state', 'Static binding'], answer: 1 }
  ],
  aptitude: [
    { id: 'a1', text: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', difficulty: 'easy', options: ['60 km/h', '80 km/h', '75 km/h', '90 km/h'], answer: 1 },
    { id: 'a2', text: 'Find the next number: 2, 6, 12, 20, 30, ?', difficulty: 'medium', options: ['40', '42', '36', '44'], answer: 1 },
    { id: 'a3', text: 'A is twice as old as B. Five years ago, A was three times as old as B. What is B\'s current age?', difficulty: 'hard', options: ['10', '15', '20', '25'], answer: 0 }
  ],
  soft: [
    { id: 's1', text: 'A teammate disagrees with your approach in a project meeting. What is the best response?', difficulty: 'easy', options: ['Insist you are right and move on', 'Listen to their reasoning and discuss trade-offs', 'Avoid the conflict entirely', 'Escalate immediately to a manager'], answer: 1 },
    { id: 's2', text: 'You are close to a deadline but discover a bug that needs more time to fix properly. What should you do?', difficulty: 'medium', options: ['Ship it and stay silent', 'Communicate the risk early and propose options', 'Ignore the bug', 'Blame a teammate'], answer: 1 }
  ]
}
