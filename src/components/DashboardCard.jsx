export default function DashboardCard({ icon: Icon, label, value, sublabel, accent = 'teal' }) {
  const accentMap = {
    teal: 'bg-teal-50 text-teal-600',
    orange: 'bg-orange-50 text-warn-500',
    red: 'bg-red-50 text-danger-500',
    blue: 'bg-blue-50 text-blue-600',
    navy: 'bg-navy-900/5 text-navy-800'
  }
  return (
    <div className="card flex items-center gap-4">
      {Icon && (
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
          <Icon size={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
        <p className="text-sm text-slate-500 truncate">{label}</p>
        {sublabel && <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}
