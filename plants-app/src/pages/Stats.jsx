import { useMemo } from 'react'
import { usePlants } from '../hooks/usePlants'
import BottomNav from '../components/BottomNav'
import { PLANT_TYPES } from '../constants'
import { format, parseISO } from 'date-fns'

function formatDate(d) {
  if (!d) return '—'
  try { return format(parseISO(d), 'dd.MM.yyyy') } catch { return '—' }
}

export default function Stats() {
  const { plants, loading } = usePlants()

  const stats = useMemo(() => {
    const typeCounts = {}
    for (const p of plants) {
      const t = p.type || 'Other'
      typeCounts[t] = (typeCounts[t] || 0) + 1
    }
    const maxCount = Math.max(...Object.values(typeCounts), 1)
    const typeList = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])

    const recent = [...plants]
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0
        const tb = b.createdAt?.seconds || 0
        return tb - ta
      })
      .slice(0, 5)

    return { typeCounts, maxCount, typeList, recent }
  }, [plants])

  return (
    <div style={{ paddingBottom: '80px', backgroundColor: '#f0f4f0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d5a27', color: '#fff',
        padding: '16px',
      }}>
        <span style={{ fontSize: '20px', fontWeight: 700 }}>📊 Statistics</span>
      </div>

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Summary cards */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'Total Plants', value: plants.length },
            { label: 'Plant Types', value: stats.typeList.length },
          ].map(({ label, value }) => (
            <div key={label} style={{
              flex: 1, backgroundColor: '#fff', borderRadius: '10px',
              padding: '16px', textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#2d5a27' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '10px', padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: '14px', fontSize: '15px' }}>By Type</h3>
          {loading ? (
            <div style={{ color: '#666', textAlign: 'center' }}>Loading...</div>
          ) : stats.typeList.length === 0 ? (
            <div style={{ color: '#999', textAlign: 'center', fontSize: '14px' }}>No data yet</div>
          ) : (
            stats.typeList.map(([type, count]) => (
              <div key={type} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>{type}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: '10px', backgroundColor: '#e8f0e8', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(count / stats.maxCount) * 100}%`,
                    backgroundColor: '#2d5a27',
                    borderRadius: '5px',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recently added */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '10px', padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: '14px', fontSize: '15px' }}>Recently Added</h3>
          {stats.recent.length === 0 ? (
            <div style={{ color: '#999', textAlign: 'center', fontSize: '14px' }}>No plants yet</div>
          ) : (
            stats.recent.map(p => (
              <div key={p.id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px',
              }}>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span style={{ color: '#666', fontSize: '12px' }}>{p.type || '—'}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
