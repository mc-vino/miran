import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePlants } from '../hooks/usePlants'
import PhotoGrid from '../components/PhotoGrid'
import { PLANT_TYPES, detectTypeFromName } from '../constants'

export default function PlantForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { plants, addPlant, updatePlant, uploadPhoto, deletePhoto } = usePlants()

  const existing = isEdit ? plants.find(p => p.id === id) : null

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [cloneDate, setCloneDate] = useState('')
  const [plantingDate, setPlantingDate] = useState('')
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (existing) {
      setName(existing.name || '')
      setType(existing.type || '')
      setCloneDate(existing.cloneDate || '')
      setPlantingDate(existing.plantingDate || '')
      setPhotos(existing.photos || [])
    }
  }, [existing?.id])

  const handleNameChange = (val) => {
    setName(val)
    const detected = detectTypeFromName(val)
    if (detected) setType(detected)
  }

  const handleAddPhoto = async (file, date) => {
    setUploading(true)
    try {
      const plantId = id || `temp_${Date.now()}`
      const photo = await uploadPhoto(plantId, file, date)
      setPhotos(prev => [...prev, photo])
    } catch (e) {
      console.error('Upload failed:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (photo) => {
    if (id) {
      await deletePhoto(id, photo)
    }
    setPhotos(prev => prev.filter(p => p.storagePath !== photo.storagePath))
  }

  const handleSave = async () => {
    if (!name.trim()) return alert('Plant name is required')
    setSaving(true)
    try {
      const data = {
        name: name.trim(),
        type,
        cloneDate: cloneDate || null,
        plantingDate: plantingDate || null,
        photos,
      }
      if (isEdit) {
        await updatePlant(id, data)
      } else {
        await addPlant(data)
      }
      navigate(-1)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '15px', outline: 'none',
    backgroundColor: '#fff',
  }
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px', display: 'block' }

  return (
    <div style={{ paddingBottom: '40px', backgroundColor: '#f0f4f0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d5a27', color: '#fff',
        padding: '16px', display: 'flex',
        alignItems: 'center', gap: '12px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
        >←</button>
        <span style={{ flex: 1, fontWeight: 600, fontSize: '17px' }}>
          {isEdit ? 'Edit Plant' : 'New Plant'}
        </span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Plant Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Alocasia Jacklyn Aurea"
            style={inputStyle}
          />
        </div>

        {/* Type */}
        <div>
          <label style={labelStyle}>Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select type...</option>
            {PLANT_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Clone date */}
        <div>
          <label style={labelStyle}>Clone Date</label>
          <input
            type="date"
            value={cloneDate}
            onChange={e => setCloneDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Planting date */}
        <div>
          <label style={labelStyle}>Planting Date</label>
          <input
            type="date"
            value={plantingDate}
            onChange={e => setPlantingDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Photos */}
        <div>
          <label style={labelStyle}>Photos</label>
          <div style={{
            backgroundColor: '#fff', borderRadius: '10px',
            padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <PhotoGrid
              photos={photos}
              onAdd={handleAddPhoto}
              onDelete={handleDeletePhoto}
              uploading={uploading}
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: '15px', borderRadius: '10px',
            backgroundColor: saving ? '#888' : '#2d5a27', border: 'none',
            color: '#fff', fontSize: '16px', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  )
}
