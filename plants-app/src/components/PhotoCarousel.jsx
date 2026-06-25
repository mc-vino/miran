import { useState, useRef } from 'react'
import { format, parseISO } from 'date-fns'

function formatDate(d) {
  if (!d) return ''
  try { return format(parseISO(d), 'dd.MM.yyyy') } catch { return d }
}

export default function PhotoCarousel({ photos, onAddPhoto }) {
  const [current, setCurrent] = useState(0)
  const startX = useRef(null)

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (dx < -50 && current < photos.length - 1) setCurrent(c => c + 1)
    if (dx > 50 && current > 0) setCurrent(c => c - 1)
    startX.current = null
  }

  if (!photos || photos.length === 0) {
    return (
      <div style={{
        width: '100%', height: '280px', backgroundColor: '#e8f0e8',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
      }}>
        <span style={{ fontSize: '48px' }}>🌱</span>
        <button
          onClick={onAddPhoto}
          style={{
            backgroundColor: '#2d5a27', color: '#fff', border: 'none',
            borderRadius: '20px', padding: '8px 20px', cursor: 'pointer', fontSize: '14px'
          }}
        >+ Add Photo</button>
      </div>
    )
  }

  const photo = photos[current]

  return (
    <div>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#000', overflow: 'hidden' }}
      >
        <img
          src={photo.url}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {photo.date && (
          <div style={{
            position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
            padding: '2px 10px', borderRadius: '10px', fontSize: '12px'
          }}>
            {formatDate(photo.date)}
          </div>
        )}
        {photos.length > 1 && (
          <>
            {current > 0 && (
              <button onClick={() => setCurrent(c => c - 1)} style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff',
                borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px'
              }}>‹</button>
            )}
            {current < photos.length - 1 && (
              <button onClick={() => setCurrent(c => c + 1)} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff',
                borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px'
              }}>›</button>
            )}
          </>
        )}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '8px 0' }}>
        {photos.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === current ? '#2d5a27' : '#ccc',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      {/* Thumbnails row */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 12px 12px', overflowX: 'auto' }}>
        {photos.map((p, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: '56px', height: '56px', flexShrink: 0,
              borderRadius: '6px', overflow: 'hidden',
              border: i === current ? '2px solid #2d5a27' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <button
          onClick={onAddPhoto}
          style={{
            width: '56px', height: '56px', flexShrink: 0,
            borderRadius: '6px', border: '2px dashed #2d5a27',
            backgroundColor: '#e8f0e8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', color: '#2d5a27',
          }}
        >+</button>
      </div>
    </div>
  )
}
