import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, User } from 'lucide-react'
import { logout } from '../features/auth/authSlice'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../features/notifications/notificationSlice'
import { toggleSidebar } from '../features/ui/uiSlice'
import { pushToast } from '../features/ui/uiSlice'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Navbar({ title }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const notifications = useSelector((s) => s.notifications.items)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (user) dispatch(fetchNotifications(user.id))
  }, [user, dispatch])

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleLogout() {
    dispatch(logout())
    dispatch(pushToast('You have been logged out.', 'info'))
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden text-slate-500" onClick={() => dispatch(toggleSidebar())}>
          <Menu size={22} />
        </button>
        <h1 className="font-semibold text-slate-800 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="relative text-slate-500 hover:text-slate-700">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-danger-500 text-white text-[10px] flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-sm text-slate-700">Notifications</p>
                {unreadCount > 0 && (
                  <button className="text-xs text-teal-600 hover:underline" onClick={() => dispatch(markAllNotificationsRead(user.id))}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No notifications yet.</p>}
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => dispatch(markNotificationRead(n.id))}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 flex gap-2 ${!n.read ? 'bg-teal-50/40' : ''}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-teal-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm text-slate-700">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-semibold">
            {user?.name?.charAt(0) || <User size={14} />}
          </div>
          <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">{user?.name}</span>
        </div>

        <button onClick={handleLogout} className="text-slate-400 hover:text-danger-500" title="Logout">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  )
}
