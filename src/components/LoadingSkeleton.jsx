export default function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  )
}
