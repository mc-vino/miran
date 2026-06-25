export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '24px',
        width: '300px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}>
        <p style={{ marginBottom: '20px', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer'
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: 'none', backgroundColor: '#dc3232', color: '#fff', cursor: 'pointer'
            }}
          >Delete</button>
        </div>
      </div>
    </div>
  )
}
