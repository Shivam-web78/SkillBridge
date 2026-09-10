import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShieldCheck, Building2, Award } from 'lucide-react'
import { fetchVerificationRequests, verifyIndustry, verifyCertificate } from '../../features/admin/adminSlice'
import { pushToast } from '../../features/ui/uiSlice'
import EmptyState from '../../components/EmptyState'

export default function Verification() {
  const dispatch = useDispatch()
  const { verificationRequests } = useSelector((s) => s.admin)
  const [tab, setTab] = useState('industry')

  useEffect(() => { dispatch(fetchVerificationRequests()) }, [dispatch])

  const industryRequests = verificationRequests.filter((r) => r.type === 'industry')
  const certRequests = verificationRequests.filter((r) => r.type === 'certificate')

  async function handleVerifyIndustry(req) {
    await dispatch(verifyIndustry({ companyId: req.refId, approve: true }))
    dispatch(pushToast(`${req.name} verified!`, 'success'))
  }

  async function handleVerifyCert(req) {
    await dispatch(verifyCertificate({ certId: req.refId, studentId: req.studentId, approve: true }))
    dispatch(pushToast(`Certificate verified!`, 'success'))
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none flex items-center gap-3">
        <ShieldCheck size={24} />
        <div>
          <h3 className="text-lg font-bold">Verification Queue</h3>
          <p className="text-slate-200 text-sm">Approve industry accounts and student certificates</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('industry')} className={`badge cursor-pointer flex items-center gap-1 ${tab === 'industry' ? 'badge-green' : 'badge-slate'}`}>
          <Building2 size={14} /> Industry ({industryRequests.length})
        </button>
        <button onClick={() => setTab('certificate')} className={`badge cursor-pointer flex items-center gap-1 ${tab === 'certificate' ? 'badge-green' : 'badge-slate'}`}>
          <Award size={14} /> Certificates ({certRequests.length})
        </button>
      </div>

      {tab === 'industry' ? (
        industryRequests.length === 0 ? (
          <EmptyState icon={Building2} title="No pending industry verifications" />
        ) : (
          <div className="space-y-3">
            {industryRequests.map((req) => (
              <div key={req.id} className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-semibold text-slate-800">{req.name}</h4>
                  <p className="text-sm text-slate-500">Industry verification request</p>
                  <p className="text-xs text-slate-400 mt-1">Requested {new Date(req.submittedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleVerifyIndustry(req)} className="btn-primary text-sm">Approve</button>
              </div>
            ))}
          </div>
        )
      ) : (
        certRequests.length === 0 ? (
          <EmptyState icon={Award} title="No pending certificate verifications" />
        ) : (
          <div className="space-y-3">
            {certRequests.map((req) => (
              <div key={req.id} className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-semibold text-slate-800">{req.name}</h4>
                  <p className="text-sm text-slate-500">Certificate verification request</p>
                  <p className="text-xs text-slate-400 mt-1">Requested {new Date(req.submittedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleVerifyCert(req)} className="btn-primary text-sm">Approve</button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
