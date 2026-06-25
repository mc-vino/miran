import { useState } from 'react'
import PlantCard from './PlantCard'

export default function TypeAccordion({ type, plants }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          backgroundColor: '#2d5a27',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{type}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            backgroundColor: '#4a8a43',
            borderRadius: '12px',
            padding: '1px 8px',
            fontSize: '12px',
            fontWeight: 600,
          }}>{plants.length}</span>
          <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: '4px 8px 8px', backgroundColor: '#e8f0e8', borderRadius: '0 0 8px 8px' }}>
          {plants.map(p => <PlantCard key={p.id} plant={p} />)}
        </div>
      )}
    </div>
  )
}
