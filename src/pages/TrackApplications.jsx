import React from 'react';

function TrackApplications() {
  const applications = [
    {
      scheme: 'PM Kisan Yojana',
      status: 'Submitted',
      color: '#3b82f6'
    },
    {
      scheme: 'Ayushman Bharat',
      status: 'Approved',
      color: '#22c55e'
    },
    {
      scheme: 'PM Awas Yojana',
      status: 'Under Review',
      color: '#f59e0b'
    }
  ];

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1>📊 Track Applications</h1>

      <div
        style={{
          display: 'grid',
          gap: '20px',
          marginTop: '30px'
        }}
      >
        {applications.map((app, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
          >
            <h2>{app.scheme}</h2>

            <span
              style={{
                background: app.color,
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px'
              }}
            >
              {app.status}
            </span>

            <div style={{ marginTop: '20px' }}>
              <div
                style={{
                  height: '10px',
                  background: '#eee',
                  borderRadius: '20px'
                }}
              >
                <div
                  style={{
                    width:
                      app.status === 'Approved'
                        ? '100%'
                        : app.status === 'Under Review'
                        ? '70%'
                        : '30%',
                    height: '10px',
                    background: app.color,
                    borderRadius: '20px'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackApplications;