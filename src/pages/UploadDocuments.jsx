import React from 'react';

function UploadDocuments() {
  const documents = [
    { name: 'Aadhaar Card', icon: '🪪' },
    { name: 'PAN Card', icon: '💳' },
    { name: 'Income Certificate', icon: '📄' },
    { name: 'Caste Certificate', icon: '🏛️' },
    { name: 'Domicile Certificate', icon: '📍' },
    { name: 'Driving License', icon: '🚗' },
    { name: 'Voter ID', icon: '🗳️' },
    { name: 'Passport', icon: '📘' },
    { name: 'Ration Card', icon: '🥫' },
    { name: 'Bank Passbook', icon: '🏦' }
  ];

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1 style={{ marginBottom: '10px' }}>📂 Document Vault</h1>

      <p
        style={{
          color: '#666',
          marginBottom: '30px'
        }}
      >
        Upload your important government documents to speed up
        scheme verification and eligibility checks.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: '20px'
        }}
      >
        {documents.map((doc, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{ marginBottom: '15px' }}>
              {doc.icon} {doc.name}
            </h3>

            <input
              type="file"
              style={{
                marginBottom: '15px',
                width: '100%'
              }}
            />

            <button
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Upload
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadDocuments;