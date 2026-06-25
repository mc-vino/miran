import { useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'

function formatDate(d) {
  if (!d) return ''
  try { return format(parseISO(d), 'dd.MM.yyyy') } catch { return d }
}

export default function PhotoGrid({ photos, onAdd, onDelete, uploading }) {
  const fileRef = useRef()
  const [pendingFile, setPendingFile] = useState(null)
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0])
  const [showDateModal, setShowDateModal] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPendingFile(file)
    setDateInput(new Date().toISOString().split('T')[0])
    setShowDateModal(true)
    e.target.value = ''
  }

  const handleConfirmDate = () => {
    if (pendingFile) {
      onAdd(pendingFile, dateInput)
      setPendingFile(null)
      setShowDateModal(false)
    }
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {showDateModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', padding: '24px',
            width: '300px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '16px' }}>Photo date</div>
            <input
              type="date"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                border: '1px solid #ddd', fontSize: '16px', marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setShowDateModal(false); setPendingFile(null) }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer'
                }}
              >Cancel</button>
              <button
                onClick={handleConfirmDate}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: 'none', backgroundColor: '#2d5a27', color: '#fff', cursor: 'pointer'
                }}
              >Add</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {photos.map((photo, i) => (
          <div key={i} style={{ position: 'relative', width: '90px' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eee' }}>
              <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '2px' }}>
              {formatDate(photo.date)}
            </div>
            <button
              onClick={() => onDelete(photo)}
              style={{
                position: 'absolute', top: '2px', right: '2px',
                width: '22px', height: '22px', borderRadius: '50%',
                backgroundColor: 'rgba(220,50,50,0.85)', border: 'none',
                color: '#fff', cursor: 'pointer', fontSize: '12px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
          </div>
        ))}

        <button
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          style={{
            width: '90px', height: '90px', borderRadius: '8px',
            border: '2px dashed #2d5a27', backgroundColor: '#e8f0e8',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', color: '#2d5a27', fontSize: '24px',
          }}
        >
          {uploading ? '⏳' : '+'}
          {!uploading && <span style={{ fontSize: '10px', marginTop: '2px' }}>Add photo</span>}
        </button>
      </div>
    </div>
  )
}
