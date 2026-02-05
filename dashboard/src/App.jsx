import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Config from './pages/Config';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard ou config
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos'); // todos, liberados, bloqueados
  const [stats, setStats] = useState({
    total: 0,
    liberados: 0,
    bloqueados: 0,
    hoje: 0
  });

  // Buscar acessos
  async function fetchAcessos() {
    setLoading(true);

    let query = supabase
      .from('acessos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter === 'liberados') {
      query = query.eq('liberado', true);
    } else if (filter === 'bloqueados') {
      query = query.eq('liberado', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar acessos:', error);
    } else {
      setAcessos(data || []);
    }

    setLoading(false);
  }

  // Buscar estatísticas
  async function fetchStats() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Total de hoje
    const { count: totalHoje } = await supabase
      .from('acessos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', hoje.toISOString());

    // Liberados de hoje
    const { count: liberadosHoje } = await supabase
      .from('acessos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', hoje.toISOString())
      .eq('liberado', true);

    // Bloqueados de hoje
    const { count: bloqueadosHoje } = await supabase
      .from('acessos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', hoje.toISOString())
      .eq('liberado', false);

    // Total geral
    const { count: total } = await supabase
      .from('acessos')
      .select('*', { count: 'exact', head: true });

    setStats({
      total: total || 0,
      liberados: liberadosHoje || 0,
      bloqueados: bloqueadosHoje || 0,
      hoje: totalHoje || 0
    });
  }

  // Configurar realtime
  useEffect(() => {
    if (currentPage !== 'dashboard') return;

    fetchAcessos();
    fetchStats();

    // Subscrever a mudanças em tempo real
    const channel = supabase
      .channel('acessos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'acessos' },
        (payload) => {
          console.log('Novo acesso:', payload);
          fetchAcessos();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, currentPage]);

  // Formatar data
  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = parseISO(dateString);
    if (isToday(date)) {
      return format(date, "'Hoje às' HH:mm", { locale: ptBR });
    }
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  // Obter mensagem do motivo de bloqueio
  function getMotivoLabel(codigo) {
    const motivos = {
      'PESSOA_INADIMPLENTE': 'Inadimplente',
      'DEPENDENTE_INADIMPLENTE': 'Dependente inadimplente',
      'SEM_AGENDAMENTO_ATUAL': 'Sem aula agendada',
      'TOKEN_NAO_ENCONTRADO': 'Token não encontrado',
      'IDENTIFICACAO_INVALIDA': 'Identificação inválida',
      'TOKEN_E_ID_NAO_CORRESPONDEM': 'Token inválido'
    };
    return motivos[codigo] || codigo || '-';
  }

  // Calcular taxa de sucesso
  const taxaSucesso = stats.hoje > 0
    ? Math.round((stats.liberados / stats.hoje) * 100)
    : 0;

  // Renderizar página de configuração
  if (currentPage === 'config') {
    return <Config onBack={() => setCurrentPage('dashboard')} />;
  }

  // Renderizar dashboard
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>
          <span>🎵</span>
          LA Music - Controle de Acesso
        </h1>
        <div className="header-actions">
          <div className="realtime-indicator">
            <div className="realtime-dot"></div>
            <span>Tempo real</span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => { fetchAcessos(); fetchStats(); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Atualizar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage('config')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Configurar
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-card-header">
            <span className="stat-card-title">Acessos Hoje</span>
            <span className="stat-card-icon">📊</span>
          </div>
          <div className="stat-card-value">{stats.hoje}</div>
          <div className="stat-card-footer">
            Taxa de sucesso: <strong>{taxaSucesso}%</strong>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-card-header">
            <span className="stat-card-title">Liberados Hoje</span>
            <span className="stat-card-icon">✅</span>
          </div>
          <div className="stat-card-value">{stats.liberados}</div>
          <div className="stat-card-footer">
            Entradas autorizadas
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-card-header">
            <span className="stat-card-title">Bloqueados Hoje</span>
            <span className="stat-card-icon">🚫</span>
          </div>
          <div className="stat-card-value">{stats.bloqueados}</div>
          <div className="stat-card-footer">
            Entradas negadas
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Histórico</span>
            <span className="stat-card-icon">📈</span>
          </div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-footer">
            Registros totais
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Histórico de Acessos</h2>
          <div className="table-filters">
            <button
              className={`filter-btn ${filter === 'todos' ? 'active' : ''}`}
              onClick={() => setFilter('todos')}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${filter === 'liberados' ? 'active' : ''}`}
              onClick={() => setFilter('liberados')}
            >
              ✅ Liberados
            </button>
            <button
              className={`filter-btn ${filter === 'bloqueados' ? 'active' : ''}`}
              onClick={() => setFilter('bloqueados')}
            >
              🚫 Bloqueados
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Carregando acessos...
            </span>
          </div>
        ) : acessos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>Nenhum acesso registrado</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
              Os registros aparecerão aqui em tempo real
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Pessoa</th>
                  <th>Curso</th>
                  <th>Motivo</th>
                  <th>Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {acessos.map((acesso, index) => (
                  <tr
                    key={acesso.id}
                    style={{
                      animationDelay: `${index * 0.03}s`,
                      animation: 'fadeIn 0.3s ease forwards'
                    }}
                  >
                    <td>
                      {acesso.liberado ? (
                        <span className="badge badge-success">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Liberado
                        </span>
                      ) : (
                        <span className="badge badge-error">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Bloqueado
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="person-cell">
                        <strong>{acesso.pessoa_nome || 'Não identificado'}</strong>
                        {acesso.pessoa_id && (
                          <span className="person-id">ID: {acesso.pessoa_id}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="course-cell">
                        {acesso.curso || '-'}
                        {acesso.professor && (
                          <span className="professor">Prof. {acesso.professor}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {!acesso.liberado && acesso.motivo_bloqueio ? (
                        <span className="badge badge-error" style={{ fontSize: '0.6875rem' }}>
                          {getMotivoLabel(acesso.motivo_bloqueio)}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <span className="date-cell">{formatDate(acesso.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>LA Music © {new Date().getFullYear()} • Sistema de Controle de Acesso</p>
      </footer>
    </div>
  );
}

export default App;
