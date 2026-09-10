import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { X, Sparkles } from 'lucide-react'
import { setSidebar } from '../features/ui/uiSlice'

const BRAND_BG = {
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  orange: 'bg-warn-500'
}

export default function Sidebar({ items, basePath, brandColor = 'teal' }) {
  const open = useSelector((s) => s.ui.sidebarOpen)
  const dispatch = useDispatch()

  const content = (
    <div className="h-full flex flex-col bg-navy-950 text-slate-300 w-64">
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg ${BRAND_BG[brandColor] || BRAND_BG.teal} flex items-center justify-center text-white`}>
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-white tracking-tight">SkillBridge</span>
        </div>
        <button className="lg:hidden text-slate-400" onClick={() => dispatch(setSidebar(false))}>
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={`${basePath}${path}`}
            end={path === ''}
            onClick={() => dispatch(setSidebar(false))}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/10 text-white font-medium' : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/5 text-xs text-slate-500">
        Smart India Hackathon 2026
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block shrink-0">{content}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => dispatch(setSidebar(false))} />
          <div className="absolute left-0 top-0 bottom-0">{content}</div>
        </div>
      )}
    </>
  )
}
