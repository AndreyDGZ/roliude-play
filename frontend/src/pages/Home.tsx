import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const Home: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Verificando conexão...');

  useEffect(() => {
    api.getHealth()
      .then((res) => setBackendStatus(`Online (${res.status})`))
      .catch(() => setBackendStatus('Offline (Backend não detectado)'));
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao Rolliude Play</h1>
      <p>A plataforma de streaming do cinema brasileiro e regional.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#222', borderRadius: '8px', maxWidth: '400px' }}>
        <strong>Status da API Backend:</strong> {backendStatus}
      </div>
    </div>
  );
};
