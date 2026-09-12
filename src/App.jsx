function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b',
      backgroundColor: '#f8fafc',
      margin: 0,
      padding: '1rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>
        DISHA Platform
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '600px', marginBottom: '1.5rem' }}>
        Digital Intelligent System for Higher Education Assistance
      </p>
      <div style={{
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ margin: 0, fontWeight: 500, color: '#059669' }}>
          ✓ Base Frontend Initialized Successfully
        </p>
      </div>
    </div>
  )
}

export default App
