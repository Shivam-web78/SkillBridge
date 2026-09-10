import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, Building2, Users2, ShieldCheck,
  HeartHandshake, BarChart3, Settings
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { label: 'Students', icon: GraduationCap, path: '/students' },
  { label: 'Industry', icon: Building2, path: '/industry' },
  { label: 'Faculty & Academia', icon: Users2, path: '/faculty' },
  { label: 'Verification', icon: ShieldCheck, path: '/verification' },
  { label: 'Collaboration', icon: HeartHandshake, path: '/collaboration' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Settings', icon: Settings, path: '/settings' }
]

const titleMap = {
  '': 'Dashboard', '/students': 'Student Management', '/industry': 'Industry Management',
  '/faculty': 'Faculty & Academia Portal', '/verification': 'Verification Center',
  '/collaboration': 'Collaboration Hub', '/analytics': 'Analytics & Reports', '/settings': 'Settings'
}

export default function AdminLayout() {
  const location = useLocation()
  const sub = location.pathname.replace('/admin', '')
  const title = titleMap[sub] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={items} basePath="/admin" brandColor="orange" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
