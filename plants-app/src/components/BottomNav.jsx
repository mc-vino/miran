import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: '🌿', label: 'Plants' },
    { path: '/stats', icon: '📊', label: 'Stats' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      zIndex: 100,
    }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              color: isActive ? '#2d5a27' : '#999',
            }}
          >
            <span style={{ fontSize: '22px' }}>{tab.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
