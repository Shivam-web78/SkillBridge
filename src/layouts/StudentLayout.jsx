import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, UserCircle, ClipboardCheck, Layers, TrendingDown, Route as RouteIcon,
  Briefcase, Building2, GraduationCap, FileCheck2, FolderKanban, Award, MessageSquare, Bell, Settings
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { label: 'My Profile', icon: UserCircle, path: '/profile' },
  { label: 'Skill Assessment', icon: ClipboardCheck, path: '/assessment' },
  { label: 'Skill Gaps', icon: TrendingDown, path: '/skill-gap' },
  { label: 'Learning Path', icon: RouteIcon, path: '/learning-path' },
  { label: 'Internships', icon: Briefcase, path: '/internships' },
  { label: 'Jobs', icon: Building2, path: '/jobs' },
  { label: 'Industry Programs', icon: GraduationCap, path: '/programs' },
  { label: 'Applications', icon: FileCheck2, path: '/applications' },
  { label: 'My Portfolio', icon: FolderKanban, path: '/portfolio' },
  { label: 'Certificates', icon: Award, path: '/certificates' },
  { label: 'Messages', icon: MessageSquare, path: '/messages' },
  { label: 'Settings', icon: Settings, path: '/settings' }
]

const titleMap = {
  '': 'Dashboard', '/profile': 'My Profile', '/assessment': 'Skill Assessment', '/skill-gap': 'Skill Gap Analysis',
  '/learning-path': 'Personalized Learning Path', '/internships': 'Internships', '/jobs': 'Jobs & Placements',
  '/programs': 'Industry Learning Programs', '/applications': 'My Applications', '/portfolio': 'My Digital Portfolio',
  '/certificates': 'Certificates', '/messages': 'Messages', '/settings': 'Settings'
}

export default function StudentLayout() {
  const location = useLocation()
  const sub = location.pathname.replace('/student', '')
  const title = titleMap[sub] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={items} basePath="/student" brandColor="teal" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
