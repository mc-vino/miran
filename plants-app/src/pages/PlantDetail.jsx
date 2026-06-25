import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { usePlants } from '../hooks/usePlants'
import PhotoCarousel from '../components/PhotoCarousel'
import ConfirmDialog from '../components/ConfirmDialog'

function formatDate(d) {
  if (!d) return '—'
  try { return format(parseISO(d), 'dd.MM.yyyy') } catch { return '—' }
}

export default function PlantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { plants, deletePlant, uploadPhoto, updatePlant } = usePlants()
  const [showConfirm, setShowConfirm] = useState(false)
  const [uploading, setUploading] = useState(false)

  const plant = plants.find(p => p.id === id)

  if (!plant) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      {plants.length === 0 ? 'Loading...' : 'Plant not found'}
    </div>
  )

  const handleDelete = async () => {
    await deletePlant(id)
    navigate('/')
  }

  const handleAddPhoto = async () => {
    // Trigger from carousel — open file picker via hidden input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      const date = new Date().toISOString().split('T')[0]
      setUploading(true)
      try {
        const photo = await uploadPhoto(id, file, date)
        const newPhotos = [...(plant.photos || []), photo]
        await updatePlant(id, { photos: newPhotos })
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  return (
    <div style={{ paddingBottom: '20px', backgroundColor: '#f0f4f0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d5a27', color: '#fff',
        padding: '16px', display: 'flex',
        alignItems: 'center', gap: '12px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '24px', cursor: 'pointer', lineHeight: 1,
          }}
        >←</button>
        <span style={{ flex: 1, fontWeight: 600, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {plant.name}
        </span>
        <button
          onClick={() => navigate(`/plant/${id}/edit`)}
          style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer',
          }}
        >✏️</button>
      </div>

      {/* Carousel */}
      <div style={{ backgroundColor: '#fff', marginBottom: '12px' }}>
        <PhotoCarousel
          photos={plant.photos || []}
          onAddPhoto={handleAddPhoto}
        />
        {uploading && (
          <div style={{ textAlign: 'center', padding: '8px', color: '#666', fontSize: '13px' }}>
            Uploading photo...
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{
        backgroundColor: '#fff', margin: '0 12px 12px', borderRadius: '10px',
        padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: '#2d5a27' }}>
          Plant Info
        </h2>
        {[
          { label: 'Type', value: plant.type || '—' },
          { label: 'Clone date', value: formatDate(plant.cloneDate) },
          { label: 'Planting date', value: formatDate(plant.plantingDate) },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: '1px solid #f0f0f0',
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>{label}</span>
            <span style={{ fontWeight: 500, fontSize: '14px' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Delete */}
      <div style={{ padding: '0 12px' }}>
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            width: '100%', padding: '14px', borderRadius: '10px',
            border: '1px solid #dc3232', backgroundColor: '#fff',
            color: '#dc3232', fontWeight: 600, cursor: 'pointer', fontSize: '15px',
          }}
        >Delete Plant</button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message={`Delete "${plant.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
