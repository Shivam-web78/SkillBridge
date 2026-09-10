import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Building2, Search, BadgeCheck, Clock } from 'lucide-react'
import { fetchAllIndustries, verifyIndustry } from '../../features/admin/adminSlice'
import { pushToast } from '../../features/ui/uiSlice'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import VerificationBadge from '../../components/VerificationBadge'

export default function AdminIndustry() {
  const dispatch = useDispatch()
  const { industries } = useSelector((s) => s.admin)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { dispatch(fetchAllIndustries()) }, [dispatch])

  const filtered = industries
    .filter((i) => !search || i.companyName.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => filter === 'all' || (filter === 'verified' ? i.verified : !i.verified))

  async function handleVerify(company) {
    await dispatch(verifyIndustry({ companyId: company.userId, approve: true }))
    dispatch(pushToast(`${company.companyName} verified!`, 'success'))
    setSelected(null)
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 size={24} />
          <div>
            <h3 className="text-lg font-bold">Industry Partners</h3>
            <p className="text-slate-200 text-sm">Manage and verify registered companies</p>
          </div>
        </div>
        <span className="text-2xl font-bold">{industries.length}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search companies…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'verified', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`badge text-xs capitalize cursor-pointer ${filter === f ? 'badge-green' : 'badge-slate'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No companies found" />
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <button
              key={c.userId}
              onClick={() => setSelected(c)}
              className="card text-left hover:shadow-md transition-shadow cursor-pointer w-full"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{c.companyName}</h4>
                  <p className="text-sm text-slate-500">{c.industry} • {c.location}</p>
                </div>
                <VerificationBadge verified={c.verified} />
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.companyName}>
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-500">Industry</p><p className="font-medium">{selected.industry}</p></div>
              <div><p className="text-xs text-slate-500">Location</p><p className="font-medium">{selected.location}</p></div>
              <div><p className="text-xs text-slate-500">Size</p><p className="font-medium">{selected.size}</p></div>
              <div><p className="text-xs text-slate-500">Status</p><p className="font-medium">{selected.verified ? 'Verified' : 'Pending'}</p></div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">About</p>
              <p className="text-sm text-slate-700">{selected.about}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelected(null)} className="btn-outline flex-1">Close</button>
              {!selected.verified && (
                <button onClick={() => handleVerify(selected)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <BadgeCheck size={16} /> Verify Company
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
