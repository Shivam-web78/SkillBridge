import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HeartHandshake } from 'lucide-react'
import { fetchCollaborations } from '../../features/admin/adminSlice'
import EmptyState from '../../components/EmptyState'

export default function AdminCollaboration() {
  const dispatch = useDispatch()
  const { collaborations } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchCollaborations()) }, [dispatch])

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none flex items-center gap-3">
        <HeartHandshake size={24} />
        <div>
          <h3 className="text-lg font-bold">Industry-Academia Collaborations</h3>
          <p className="text-slate-200 text-sm">Platform-wide view of all active partnerships</p>
        </div>
      </div>

      {collaborations.length === 0 ? (
        <EmptyState icon={HeartHandshake} title="No collaborations recorded" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {collaborations.map((c) => (
            <div key={c.id} className="card">
              <h4 className="font-semibold text-slate-800">{c.title}</h4>
              <p className="text-sm text-slate-500">{c.company}</p>
              <p className="text-sm text-slate-700 mt-2">{c.description}</p>
              <div className="flex gap-2 mt-3">
                <span className="badge-blue text-xs">{c.type}</span>
                <span className="badge-green text-xs capitalize">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
