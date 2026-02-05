import { useState } from 'react';
import Config from './pages/Config';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('config'); // Inicia na config

  // Renderizar página de configuração
  if (currentPage === 'config') {
    return <Config onBack={() => setCurrentPage('dashboard')} />;
  }

  // Renderizar dashboard (simplificado - sem Supabase)
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>
          <span>🎵</span>
          LA Music - Controle de Acesso
        </h1>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage('config')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Configurar Catraca
          </button>
        </div>
      </header>

      {/* Conteudo Principal */}
      <div className="main-content">
        <div className="welcome-card">
          <div className="welcome-icon">🚪</div>
          <h2>Sistema de Controle de Acesso</h2>
          <p>Clique em "Configurar Catraca" para conectar e testar a catraca.</p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => setCurrentPage('config')}
          >
            Configurar Catraca
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>LA Music © {new Date().getFullYear()} • Sistema de Controle de Acesso</p>
      </footer>
    </div>
  );
}

export default App;
