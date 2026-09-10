import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { dismissToast } from '../features/ui/uiSlice'

const iconMap = { success: CheckCircle2, error: AlertCircle, info: Info }
const colorMap = {
  success: 'bg-teal-500',
  error: 'bg-danger-500',
  info: 'bg-navy-800'
}

export default function ToastContainer() {
  const toasts = useSelector((s) => s.ui.toasts)
  const dispatch = useDispatch()

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => dispatch(dismissToast(t.id)), 4000))
    return () => timers.forEach(clearTimeout)
  }, [toasts, dispatch])

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm">
      {toasts.map((t) => {
        const Icon = iconMap[t.type] || Info
        return (
          <div key={t.id} className={`${colorMap[t.type] || colorMap.info} text-white rounded-xl shadow-soft px-4 py-3 flex items-start gap-3 animate-[fadeIn_0.2s_ease]`}>
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm flex-1">{t.message}</p>
            <button onClick={() => dispatch(dismissToast(t.id))} className="opacity-70 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
