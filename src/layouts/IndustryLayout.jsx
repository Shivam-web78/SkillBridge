import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Building2, PlusCircle, Briefcase, GraduationCap, Users,
  Sparkles, FileCheck2, FolderKanban, HeartHandshake, MessageSquare, BarChart3, Settings
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { label: 'Company Profile', icon: Building2, path: '/profile' },
  { label: 'Post Internship', icon: PlusCircle, path: '/post-internship' },
  { label: 'Post Job', icon: Briefcase, path: '/post-job' },
  { label: 'Learning Programs', icon: GraduationCap, path: '/programs' },
  { label: 'Candidates', icon: Users, path: '/candidates' },
  { label: 'AI Matching', icon: Sparkles, path: '/matching' },
  { label: 'Applications', icon: FileCheck2, path: '/applications' },
  { label: 'Collaboration', icon: HeartHandshake, path: '/collaboration' },
  { label: 'Messages', icon: MessageSquare, path: '/messages' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Settings', icon: Settings, path: '/settings' }
]

const titleMap = {
  '': 'Dashboard', '/profile': 'Company Profile', '/post-internship': 'Post Internship', '/post-job': 'Post Job',
  '/programs': 'Learning Programs', '/candidates': 'Candidate Screening', '/matching': 'AI Candidate Matching',
  '/applications': 'Applications', '/collaboration': 'Industry Collaboration', '/messages': 'Messages',
  '/analytics': 'Analytics', '/settings': 'Settings'
}

export default function IndustryLayout() {
  const location = useLocation()
  const sub = location.pathname.replace('/industry', '')
  const title = titleMap[sub] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={items} basePath="/industry" brandColor="blue" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
