import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users, Search, Filter } from 'lucide-react'
import { fetchAllStudents } from '../../features/admin/adminSlice'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'

export default function AdminStudents() {
  const dispatch = useDispatch()
  const { students } = useSelector((s) => s.admin)
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => { dispatch(fetchAllStudents()) }, [dispatch])

  const filtered = students.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users size={24} />
          <div>
            <h3 className="text-lg font-bold">Student Management</h3>
            <p className="text-slate-200 text-sm">Monitor student profiles and activity</p>
          </div>
        </div>
        <span className="text-2xl font-bold">{students.length}</span>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search students…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No students found" />
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => (
            <button
              key={s.userId}
              onClick={() => setSelectedStudent(s)}
              className="card text-left hover:shadow-md transition-shadow cursor-pointer w-full"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{s.name}</h4>
                  <p className="text-sm text-slate-500">{s.email}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.college} • {s.branch}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-semibold text-slate-800">{Math.round(s.profileCompletion || 0)}%</p>
                  <p className="text-slate-500">Completed</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent?.name}>
        {selectedStudent && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-800">{selectedStudent.email}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">College</p>
                <p className="font-medium text-slate-800">{selectedStudent.college}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Branch</p>
                <p className="font-medium text-slate-800">{selectedStudent.branch}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">CGPA</p>
                <p className="font-medium text-slate-800">{selectedStudent.cgpa || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Profile Completion</p>
                <p className="font-medium text-slate-800">{Math.round(selectedStudent.profileCompletion || 0)}%</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-xs">
              <p className="font-medium text-slate-700 mb-1">Actions</p>
              <div className="flex gap-1 flex-wrap">
                <button className="badge-blue text-xs cursor-pointer">View Profile</button>
                <button className="badge-orange text-xs cursor-pointer">Send Alert</button>
              </div>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="btn-outline w-full">Close</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
