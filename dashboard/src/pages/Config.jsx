import { useState, useEffect, useCallback } from 'react';
import { configApi } from '../lib/api';

/**
 * Página de Configuração da Catraca
 * Permite descobrir, conectar e configurar a catraca
 */
function Config({ onBack }) {
    // Estados
    const [status, setStatus] = useState({ connected: false, device: null });
    const [networks, setNetworks] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [devices, setDevices] = useState([]);
    const [logs, setLogs] = useState([]);
    const [webhookUrl, setWebhookUrl] = useState('http://localhost:3000/webhook');
    const [loading, setLoading] = useState({
        status: false,
        networks: false,
        discover: false,
        connect: false,
        disconnect: false,
        test: false,
        webhook: false
    });
    const [middlewareOnline, setMiddlewareOnline] = useState(false);

    // Adiciona log com timestamp
    const addLog = useCallback((message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        setLogs(prev => [{
            id: Date.now(),
            timestamp,
            message,
            type
        }, ...prev].slice(0, 50)); // Mantém últimos 50 logs
    }, []);

    // Busca status inicial
    const fetchStatus = useCallback(async () => {
        setLoading(prev => ({ ...prev, status: true }));
        try {
            const response = await configApi.getStatus();
            setStatus(response.data);
            setMiddlewareOnline(true);
            if (response.data.connected) {
                addLog(`Conectado a ${response.data.device?.name || 'dispositivo'}`, 'success');
            }
        } catch (error) {
            setMiddlewareOnline(false);
            addLog('Middleware offline - Inicie o servidor', 'error');
        } finally {
            setLoading(prev => ({ ...prev, status: false }));
        }
    }, [addLog]);

    // Busca redes disponíveis
    const fetchNetworks = useCallback(async () => {
        setLoading(prev => ({ ...prev, networks: true }));
        try {
            const response = await configApi.getNetworks();
            setNetworks(response.data || []);
            if (response.data?.length > 0) {
                setSelectedNetwork(response.data[0]);
                addLog(`${response.data.length} rede(s) encontrada(s)`, 'info');
            }
        } catch (error) {
            addLog('Erro ao buscar redes: ' + error.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, networks: false }));
        }
    }, [addLog]);

    // Descobre dispositivos
    const discoverDevices = async () => {
        setLoading(prev => ({ ...prev, discover: true }));
        addLog(`Buscando dispositivos na rede ${selectedNetwork || 'padrão'}...`, 'info');
        try {
            const response = await configApi.discoverDevices(selectedNetwork);
            setDevices(response.data || []);
            addLog(`${response.count || 0} dispositivo(s) encontrado(s)`, response.count > 0 ? 'success' : 'warning');
        } catch (error) {
            addLog('Erro ao descobrir dispositivos: ' + error.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, discover: false }));
        }
    };

    // Conecta a um dispositivo
    const connectDevice = async (ip, type) => {
        setLoading(prev => ({ ...prev, connect: true }));
        addLog(`Conectando a ${ip}...`, 'info');
        try {
            const response = await configApi.connect(ip, type);
            setStatus({ connected: true, device: response.data });
            addLog(`Conectado a ${response.data.name} (${ip})`, 'success');
        } catch (error) {
            addLog('Erro ao conectar: ' + error.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, connect: false }));
        }
    };

    // Desconecta
    const disconnectDevice = async () => {
        setLoading(prev => ({ ...prev, disconnect: true }));
        addLog('Desconectando...', 'info');
        try {
            await configApi.disconnect();
            setStatus({ connected: false, device: null });
            addLog('Desconectado com sucesso', 'success');
        } catch (error) {
            addLog('Erro ao desconectar: ' + error.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, disconnect: false }));
        }
    };

    // Testa liberação
    const testRelease = async () => {
        setLoading(prev => ({ ...prev, test: true }));
        addLog('Testando liberação de entrada...', 'info');
        try {
            await configApi.test('Teste OK!');
            addLog('✅ Teste executado com sucesso!', 'success');
        } catch (error) {
            addLog('Erro no teste: ' + error.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, test: false }));
        }
    };

    // Configura webhook
    const setupWebhook = async () => {
        if (!webhookUrl) return;
        setLoading(prev => ({ ...prev, webhook: true }));
        addLog(`Configurando webhook: ${webhookUrl}`, 'info');
        try {
            await configApi.setWebhook(webhookUrl);
            addLog('Webhook configurado com sucesso!', 'success');
        } catch (error) {
            addLog('Erro ao configurar webhook: ' + error.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, webhook: false }));
        }
    };

    // Carrega dados iniciais
    useEffect(() => {
        fetchStatus();
        fetchNetworks();
        addLog('Página de configuração carregada', 'info');
    }, [fetchStatus, fetchNetworks, addLog]);

    // Atualiza status periodicamente
    useEffect(() => {
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    return (
        <div className="config-page">
            {/* Header */}
            <header className="config-header">
                <div className="config-header-left">
                    <button className="back-btn" onClick={onBack}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Voltar
                    </button>
                    <h1>
                        <span>⚙️</span>
                        Configuração da Catraca
                    </h1>
                </div>
                <div className="middleware-status">
                    <div className={`status-dot ${middlewareOnline ? 'online' : 'offline'}`}></div>
                    <span>Middleware {middlewareOnline ? 'Online' : 'Offline'}</span>
                </div>
            </header>

            {/* Grid Principal */}
            <div className="config-grid">
                {/* Coluna Esquerda */}
                <div className="config-column">
                    {/* Card de Status */}
                    <div className="config-card">
                        <div className="config-card-header">
                            <h2>
                                <span>📡</span>
                                Status da Conexão
                            </h2>
                        </div>
                        <div className="config-card-body">
                            <div className="status-display">
                                <div className={`status-indicator ${status.connected ? 'connected' : 'disconnected'}`}>
                                    <div className="status-icon">
                                        {status.connected ? '🟢' : '🔴'}
                                    </div>
                                    <span>{status.connected ? 'Conectado' : 'Desconectado'}</span>
                                </div>

                                {status.device && (
                                    <div className="device-info">
                                        <div className="info-row">
                                            <span className="label">Nome:</span>
                                            <span className="value">{status.device.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">IP:</span>
                                            <span className="value">{status.device.ip}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Tipo:</span>
                                            <span className="value">{status.device.typeName}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card de Ações */}
                    <div className="config-card">
                        <div className="config-card-header">
                            <h2>
                                <span>🎯</span>
                                Ações Rápidas
                            </h2>
                        </div>
                        <div className="config-card-body">
                            <div className="actions-grid">
                                {status.connected ? (
                                    <button
                                        className="action-btn danger"
                                        onClick={disconnectDevice}
                                        disabled={loading.disconnect}
                                    >
                                        {loading.disconnect ? (
                                            <div className="btn-spinner"></div>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                                <line x1="12" y1="2" x2="12" y2="12" />
                                            </svg>
                                        )}
                                        Desconectar
                                    </button>
                                ) : (
                                    <button
                                        className="action-btn primary"
                                        onClick={() => devices[0] && connectDevice(devices[0].ip, devices[0].type)}
                                        disabled={!devices.length || loading.connect}
                                    >
                                        {loading.connect ? (
                                            <div className="btn-spinner"></div>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14" />
                                                <path d="M12 5l7 7-7 7" />
                                            </svg>
                                        )}
                                        Conectar
                                    </button>
                                )}

                                <button
                                    className="action-btn success"
                                    onClick={testRelease}
                                    disabled={!status.connected || loading.test}
                                >
                                    {loading.test ? (
                                        <div className="btn-spinner"></div>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    )}
                                    Testar Entrada
                                </button>
                            </div>

                            {/* Webhook Config */}
                            <div className="webhook-config">
                                <label>URL do Webhook:</label>
                                <div className="webhook-input-group">
                                    <input
                                        type="text"
                                        value={webhookUrl}
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                        placeholder="http://localhost:3000/webhook"
                                    />
                                    <button
                                        className="action-btn secondary"
                                        onClick={setupWebhook}
                                        disabled={!status.connected || loading.webhook}
                                    >
                                        {loading.webhook ? (
                                            <div className="btn-spinner"></div>
                                        ) : (
                                            '⚙️'
                                        )}
                                        Configurar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita */}
                <div className="config-column">
                    {/* Card de Descoberta */}
                    <div className="config-card">
                        <div className="config-card-header">
                            <h2>
                                <span>🔍</span>
                                Descobrir Catracas
                            </h2>
                        </div>
                        <div className="config-card-body">
                            <div className="discover-controls">
                                <div className="network-select">
                                    <label>Rede:</label>
                                    <select
                                        value={selectedNetwork}
                                        onChange={(e) => setSelectedNetwork(e.target.value)}
                                        disabled={loading.networks}
                                    >
                                        {networks.length === 0 && (
                                            <option value="">Nenhuma rede</option>
                                        )}
                                        {networks.map((net, i) => (
                                            <option key={i} value={net}>{net}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    className="discover-btn"
                                    onClick={discoverDevices}
                                    disabled={loading.discover}
                                >
                                    {loading.discover ? (
                                        <div className="btn-spinner"></div>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="M21 21l-4.35-4.35" />
                                        </svg>
                                    )}
                                    Buscar
                                </button>
                            </div>

                            {/* Lista de Dispositivos */}
                            <div className="devices-list">
                                {devices.length === 0 ? (
                                    <div className="no-devices">
                                        <span className="icon">📭</span>
                                        <p>Nenhum dispositivo encontrado</p>
                                        <small>Clique em "Buscar" para descobrir catracas na rede</small>
                                    </div>
                                ) : (
                                    devices.map((device) => (
                                        <div
                                            key={device.id || device.ip}
                                            className={`device-card ${device.connected ? 'connected' : ''}`}
                                        >
                                            <div className="device-card-info">
                                                <div className="device-name">
                                                    <span className="device-icon">🚪</span>
                                                    {device.name || `Dispositivo ${device.type}`}
                                                </div>
                                                <div className="device-details">
                                                    <span>IP: {device.ip}</span>
                                                    <span>•</span>
                                                    <span>Tipo: {device.typeName || `Tipo ${device.type}`}</span>
                                                </div>
                                            </div>
                                            <button
                                                className={`device-action-btn ${device.connected ? 'connected' : ''}`}
                                                onClick={() => device.connected ? disconnectDevice() : connectDevice(device.ip, device.type)}
                                                disabled={loading.connect || loading.disconnect}
                                            >
                                                {device.connected ? 'Conectado ✓' : 'Conectar'}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card de Logs */}
                    <div className="config-card logs-card">
                        <div className="config-card-header">
                            <h2>
                                <span>📋</span>
                                Logs de Atividade
                            </h2>
                            <button
                                className="clear-logs-btn"
                                onClick={() => setLogs([])}
                            >
                                Limpar
                            </button>
                        </div>
                        <div className="config-card-body">
                            <div className="logs-container">
                                {logs.length === 0 ? (
                                    <div className="no-logs">
                                        <span>Nenhum log ainda...</span>
                                    </div>
                                ) : (
                                    logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className={`log-entry ${log.type}`}
                                        >
                                            <span className="log-time">{log.timestamp}</span>
                                            <span className="log-message">{log.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Config;
