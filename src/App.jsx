import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/Toast'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { NotFoundPage, AccessDeniedPage } from './pages/StatusPages'

import StudentLayout from './layouts/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import SkillAssessment from './pages/student/SkillAssessment'
import SkillGap from './pages/student/SkillGap'
import LearningPath from './pages/student/LearningPath'
import StudentInternships from './pages/student/Internships'
import StudentJobs from './pages/student/Jobs'
import IndustryPrograms from './pages/student/IndustryPrograms'
import StudentApplications from './pages/student/Applications'
import Portfolio from './pages/student/Portfolio'
import Certificates from './pages/student/Certificates'
import Messages from './pages/Messages'
import Settings from './pages/Settings'

import IndustryLayout from './layouts/IndustryLayout'
import IndustryDashboard from './pages/industry/IndustryDashboard'
import CompanyProfile from './pages/industry/CompanyProfile'
import PostInternship from './pages/industry/PostInternship'
import PostJob from './pages/industry/PostJob'
import IndustryLearningPrograms from './pages/industry/LearningPrograms'
import Candidates from './pages/industry/Candidates'
import AIMatching from './pages/industry/AIMatching'
import IndustryApplications from './pages/industry/Applications'
import Collaboration from './pages/industry/Collaboration'
import IndustryAnalytics from './pages/industry/Analytics'

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/Students'
import AdminIndustry from './pages/admin/Industry'
import AdminFaculty from './pages/admin/Faculty'
import AdminVerification from './pages/admin/Verification'
import AdminCollaboration from './pages/admin/AdminCollaboration'
import AdminAnalytics from './pages/admin/Analytics'

export default function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="assessment" element={<SkillAssessment />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="internships" element={<StudentInternships />} />
          <Route path="jobs" element={<StudentJobs />} />
          <Route path="programs" element={<IndustryPrograms />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="messages" element={<Messages role="student" />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/industry" element={<ProtectedRoute role="industry"><IndustryLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<IndustryDashboard />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="post-internship" element={<PostInternship />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="programs" element={<IndustryLearningPrograms />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="matching" element={<AIMatching />} />
          <Route path="applications" element={<IndustryApplications />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="messages" element={<Messages role="industry" />} />
          <Route path="analytics" element={<IndustryAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="industry" element={<AdminIndustry />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="collaboration" element={<AdminCollaboration />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
