export default function ProgressBar({ value, label, color = 'teal', showValue = true, height = 'h-2.5' }) {
  const colorMap = {
    teal: 'bg-teal-500',
    orange: 'bg-warn-500',
    red: 'bg-danger-500',
    navy: 'bg-navy-800',
    blue: 'bg-blue-500'
  }
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5 text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showValue && <span className="font-semibold text-slate-800">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorMap[color]} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
