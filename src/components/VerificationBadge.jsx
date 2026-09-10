import { BadgeCheck, Clock } from 'lucide-react'

export default function VerificationBadge({ verified }) {
  if (verified) {
    return (
      <span className="badge-green">
        <BadgeCheck size={14} /> Verified
      </span>
    )
  }
  return (
    <span className="badge-slate">
      <Clock size={14} /> Pending
    </span>
  )
}
