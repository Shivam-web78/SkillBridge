import { useRef, useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'

export default function UploadBox({ label = 'Upload file', accept = '.pdf,.doc,.docx', onFile, uploading, uploadedName }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(files) {
    if (files && files[0]) onFile(files[0])
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-teal-400 bg-teal-50' : 'border-slate-300 hover:border-teal-300'}`}
    >
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => handleFiles(e.target.files)} />
      {uploading ? (
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <div className="h-8 w-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Parsing document…</p>
        </div>
      ) : uploadedName ? (
        <div className="flex flex-col items-center gap-2">
          <FileText className="text-teal-500" size={28} />
          <p className="text-sm font-medium text-slate-700">{uploadedName}</p>
          <p className="text-xs text-slate-400">Click to replace</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <UploadCloud size={28} />
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-slate-400">Drag & drop or click to browse (PDF/DOCX)</p>
        </div>
      )}
    </div>
  )
}
