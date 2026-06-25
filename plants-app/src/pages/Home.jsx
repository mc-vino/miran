import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants } from '../hooks/usePlants'
import TypeAccordion from '../components/TypeAccordion'
import BottomNav from '../components/BottomNav'
import { PLANT_TYPES } from '../constants'

export default function Home() {
  const navigate = useNavigate()
  const { plants, loading } = usePlants()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    let list = plants.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    )

    list.sort((a, b) => {
      let va, vb
      if (sortBy === 'name') {
        va = a.name?.toLowerCase() || ''
        vb = b.name?.toLowerCase() || ''
      } else if (sortBy === 'cloneDate') {
        va = a.cloneDate || ''
        vb = b.cloneDate || ''
      } else {
        va = a.plantingDate || ''
        vb = b.plantingDate || ''
      }
      if (va < vb) return sortAsc ? -1 : 1
      if (va > vb) return sortAsc ? 1 : -1
      return 0
    })

    return list
  }, [plants, search, sortBy, sortAsc])

  const grouped = useMemo(() => {
    const groups = {}
    for (const p of filtered) {
      const t = p.type || 'Other'
      if (!groups[t]) groups[t] = []
      groups[t].push(p)
    }
    // Sort groups by PLANT_TYPES order
    const ordered = {}
    for (const t of [...PLANT_TYPES, 'Other']) {
      if (groups[t]) ordered[t] = groups[t]
    }
    return ordered
  }, [filtered])

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d5a27', color: '#fff',
        padding: '16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: '20px', fontWeight: 700 }}>🌿 Plants</span>
        <button
          onClick={() => navigate('/add')}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: '#4a8a43', border: 'none',
            color: '#fff', fontSize: '22px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >+</button>
      </div>

      <div style={{ padding: '12px' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '20px',
            border: '1px solid #ddd', fontSize: '14px',
            backgroundColor: '#fff', marginBottom: '10px', outline: 'none',
          }}
        />

        {/* Sort controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: '8px',
              border: '1px solid #ddd', fontSize: '14px',
              backgroundColor: '#fff', outline: 'none',
            }}
          >
            <option value="name">Name</option>
            <option value="cloneDate">Clone date</option>
            <option value="plantingDate">Planting date</option>
          </select>
          <button
            onClick={() => setSortAsc(a => !a)}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              border: '1px solid #ddd', backgroundColor: '#fff',
              cursor: 'pointer', fontSize: '14px',
            }}
          >{sortAsc ? '↑ Asc' : '↓ Desc'}</button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            Loading...
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
            <div style={{ fontWeight: 600, marginBottom: '8px' }}>No plants yet</div>
            <div style={{ fontSize: '14px' }}>Tap + to add your first plant</div>
          </div>
        ) : (
          Object.entries(grouped).map(([type, plants]) => (
            <TypeAccordion key={type} type={type} plants={plants} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
