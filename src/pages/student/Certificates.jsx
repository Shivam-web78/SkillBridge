import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Award, Plus } from 'lucide-react'
import { fetchCertificates, uploadCertificate } from '../../features/student/studentSlice'
import { pushToast } from '../../features/ui/uiSlice'
import VerificationBadge from '../../components/VerificationBadge'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'

export default function Certificates() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { certificates } = useSelector((s) => s.student)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', issuer: '' })
  const [adding, setAdding] = useState(false)

  useEffect(() => { if (user) dispatch(fetchCertificates(user.id)) }, [user, dispatch])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name || !form.issuer) return
    setAdding(true)
    const result = await dispatch(uploadCertificate({ userId: user.id, name: form.name, issuer: form.issuer }))
    setAdding(false)
    if (uploadCertificate.fulfilled.match(result)) {
      dispatch(pushToast('Certificate added! Admin will verify it.', 'success'))
      setForm({ name: '', issuer: '' })
      setShowAdd(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Your Certificates</h3>
          <p className="text-slate-200 text-sm mt-1">Showcase verified credentials on your professional profile.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn bg-white text-purple-600 hover:bg-slate-100 flex items-center gap-2 shrink-0">
          <Plus size={16} /> Add
        </button>
      </div>

      {certificates.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet" description="Add your certifications to build your profile." />
      ) : (
        <div className="grid gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-semibold text-slate-800">{cert.name}</h4>
                  <p className="text-sm text-slate-500">{cert.issuer}</p>
                  <p className="text-xs text-slate-400 mt-1">Issued {cert.issuedDate}</p>
                  <p className="text-xs text-slate-500 mt-1">ID: {cert.credentialId}</p>
                </div>
                <VerificationBadge verified={cert.verified} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Certificate">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Certificate Name</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. AWS Certified Cloud Practitioner"
            />
          </div>
          <div>
            <label className="label">Issuer / Provider</label>
            <input
              className="input"
              required
              value={form.issuer}
              onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
              placeholder="e.g. Amazon Web Services"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
            Certificates will be verified by the institution admin and displayed on your portfolio once approved.
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={adding} className="btn-primary flex-1">
              {adding ? '...' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
