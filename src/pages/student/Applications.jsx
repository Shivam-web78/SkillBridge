import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar } from 'lucide-react'
import { fetchApplications } from '../../features/student/studentSlice'
import ApplicationTimeline from '../../components/ApplicationTimeline'
import EmptyState from '../../components/EmptyState'

export default function StudentApplications() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { applications } = useSelector((s) => s.student)

  useEffect(() => { if (user) dispatch(fetchApplications(user.id)) }, [user, dispatch])

  const internshipApps = applications.filter((a) => a.type === 'internship')
  const jobApps = applications.filter((a) => a.type === 'job')

  return (
    <div className="space-y-6 max-w-4xl">
      {internshipApps.length === 0 && jobApps.length === 0 ? (
        <EmptyState icon={Calendar} title="No applications yet" description="Apply to internships or jobs to see them here." />
      ) : (
        <>
          {internshipApps.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Internship Applications ({internshipApps.length})</h3>
              <div className="space-y-3">
                {internshipApps.map((app) => (
                  <div key={app.id} className="card">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="font-semibold text-slate-800">{app.title}</h4>
                        <p className="text-sm text-slate-500">{app.company}</p>
                        <p className="text-xs text-slate-400 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <ApplicationTimeline status={app.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jobApps.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Job Applications ({jobApps.length})</h3>
              <div className="space-y-3">
                {jobApps.map((app) => (
                  <div key={app.id} className="card">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="font-semibold text-slate-800">{app.title}</h4>
                        <p className="text-sm text-slate-500">{app.company}</p>
                        <p className="text-xs text-slate-400 mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <ApplicationTimeline status={app.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
