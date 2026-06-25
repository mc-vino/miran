import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

function formatDate(d) {
  if (!d) return '—'
  try { return format(parseISO(d), 'dd.MM.yyyy') } catch { return '—' }
}

export default function PlantCard({ plant }) {
  const navigate = useNavigate()
  const thumb = plant.photos?.[0]?.url

  return (
    <div
      onClick={() => navigate(`/plant/${plant.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        margin: '6px 0',
      }}
    >
      <div style={{
        width: 60,
        height: 60,
        borderRadius: '6px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: '#e8f0e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {thumb
          ? <img src={thumb} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '24px' }}>🌱</span>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {plant.name}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Clone: {formatDate(plant.cloneDate)}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Planted: {formatDate(plant.plantingDate)}
        </div>
      </div>
      <span style={{ color: '#ccc', fontSize: '18px' }}>›</span>
    </div>
  )
}
