/**
 * Cliente HTTP para comunicação com o Middleware da Catraca
 */

const MIDDLEWARE_URL = 'http://localhost:3000';

/**
 * Faz uma requisição ao middleware
 */
async function request(endpoint, options = {}) {
    const url = `${MIDDLEWARE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * API de Configuração da Catraca
 */
export const configApi = {
    /**
     * Obtém as interfaces de rede disponíveis
     */
    async getNetworks() {
        return request('/api/config/networks');
    },

    /**
     * Descobre dispositivos na rede
     */
    async discoverDevices(network) {
        const params = network ? `?network=${encodeURIComponent(network)}` : '';
        return request(`/api/config/discover${params}`);
    },

    /**
     * Obtém o status atual da conexão
     */
    async getStatus() {
        return request('/api/config/status');
    },

    /**
     * Conecta a um dispositivo
     */
    async connect(ip, type) {
        return request('/api/config/connect', {
            method: 'POST',
            body: JSON.stringify({ ip, type })
        });
    },

    /**
     * Desconecta do dispositivo atual
     */
    async disconnect() {
        return request('/api/config/disconnect', {
            method: 'POST'
        });
    },

    /**
     * Testa a liberação de entrada
     */
    async test(message = 'Teste OK!') {
        return request('/api/config/test', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    },

    /**
     * Configura o webhook na catraca
     */
    async setWebhook(url) {
        return request('/api/config/webhook', {
            method: 'POST',
            body: JSON.stringify({ url })
        });
    },

    /**
     * Lista dispositivos conhecidos
     */
    async getDevices() {
        return request('/api/config/devices');
    },

    /**
     * Health check do middleware
     */
    async healthCheck() {
        return request('/health');
    }
};

export default configApi;
