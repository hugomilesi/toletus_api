const axios = require('axios');
const https = require('https');
const config = require('../config');
const logger = require('../logger');

// Cliente HTTP para Toletus HUB (aceita certificado auto-assinado)
const toletusClient = axios.create({
    baseURL: config.toletus.hubUrl,
    timeout: 10000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Estado da conexão com a catraca
let connectedDevice = null;

/**
 * Descobre dispositivos na rede
 * @returns {Promise<Array>} Lista de dispositivos encontrados
 */
async function discoverDevices() {
    try {
        logger.info('Descobrindo dispositivos na rede...');

        const response = await toletusClient.get('/DeviceConnection/DiscoverDevices');

        if (response.data.success) {
            logger.info('Dispositivos encontrados', {
                quantidade: response.data.data?.length || 0
            });
            return response.data.data || [];
        }

        logger.warn('Falha ao descobrir dispositivos', { message: response.data.message });
        return [];
    } catch (error) {
        logger.error('Erro ao descobrir dispositivos', { error: error.message });
        throw error;
    }
}

/**
 * Conecta a um dispositivo específico
 * @param {string} ip - IP do dispositivo
 * @param {number} type - Tipo do dispositivo (0=LiteNet1, 1=LiteNet2, 2=LiteNet3, 3=SM25)
 * @returns {Promise<Object>} Dados do dispositivo conectado
 */
async function connect(ip = config.toletus.catracaIp, type = config.toletus.catracaType) {
    try {
        logger.info('Conectando ao dispositivo', { ip, type });

        const response = await toletusClient.post(
            `/DeviceConnection/Connect?ip=${ip}&type=${type}`
        );

        if (response.data.success) {
            connectedDevice = response.data.data;
            logger.info('Dispositivo conectado com sucesso', {
                id: connectedDevice.id,
                name: connectedDevice.name,
                ip: connectedDevice.ip
            });
            return connectedDevice;
        }

        logger.error('Falha ao conectar', { message: response.data.message });
        throw new Error(response.data.message);
    } catch (error) {
        if (error.response?.data?.message === 'Device is already connected') {
            logger.info('Dispositivo já estava conectado');
            // Buscar dispositivo já conectado
            const devices = await getDevices();
            connectedDevice = devices.find(d => d.ip === ip && d.connected);
            return connectedDevice;
        }
        logger.error('Erro ao conectar dispositivo', { error: error.message });
        throw error;
    }
}

/**
 * Desconecta do dispositivo
 * @param {string} ip - IP do dispositivo
 * @param {number} type - Tipo do dispositivo
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function disconnect(ip = config.toletus.catracaIp, type = config.toletus.catracaType) {
    try {
        logger.info('Desconectando do dispositivo', { ip, type });

        const response = await toletusClient.post(
            `/DeviceConnection/Disconnect?ip=${ip}&type=${type}`
        );

        if (response.data.success) {
            connectedDevice = null;
            logger.info('Dispositivo desconectado com sucesso');
            return true;
        }

        return false;
    } catch (error) {
        logger.error('Erro ao desconectar dispositivo', { error: error.message });
        throw error;
    }
}

/**
 * Obtém lista de dispositivos (do cache ou nova descoberta)
 * @returns {Promise<Array>} Lista de dispositivos
 */
async function getDevices() {
    try {
        const response = await toletusClient.get('/DeviceConnection/GetDevices');

        if (response.data.success) {
            return response.data.data || [];
        }

        return [];
    } catch (error) {
        logger.error('Erro ao obter dispositivos', { error: error.message });
        throw error;
    }
}

/**
 * Libera entrada na catraca com mensagem
 * @param {string} message - Mensagem a exibir
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function releaseEntry(message = 'Bem-vindo!') {
    try {
        if (!connectedDevice) {
            throw new Error('Nenhum dispositivo conectado');
        }

        logger.info('Liberando entrada', { message, deviceId: connectedDevice.id });

        // Determinar endpoint baseado no tipo de dispositivo
        const endpoint = getCommandEndpoint('ReleaseEntry');

        const response = await toletusClient.post(
            `${endpoint}?message=${encodeURIComponent(message)}`,
            connectedDevice  // Device obrigatório no body
        );

        const success = response.data.response?.success !== false;

        if (success) {
            logger.info('Entrada liberada com sucesso');
        } else {
            logger.warn('Falha ao liberar entrada', { response: response.data });
        }

        return success;
    } catch (error) {
        logger.error('Erro ao liberar entrada', { error: error.message });
        throw error;
    }
}

/**
 * Libera saída na catraca com mensagem
 * @param {string} message - Mensagem a exibir
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function releaseExit(message = 'Até logo!') {
    try {
        if (!connectedDevice) {
            throw new Error('Nenhum dispositivo conectado');
        }

        logger.info('Liberando saída', { message, deviceId: connectedDevice.id });

        const endpoint = getCommandEndpoint('ReleaseExit');

        const response = await toletusClient.post(
            `${endpoint}?message=${encodeURIComponent(message)}`,
            connectedDevice  // Device obrigatório no body
        );

        const success = response.data.response?.success !== false;

        if (success) {
            logger.info('Saída liberada com sucesso');
        }

        return success;
    } catch (error) {
        logger.error('Erro ao liberar saída', { error: error.message });
        throw error;
    }
}

/**
 * Envia notificação para a catraca (beep, cor, mensagem)
 * @param {Object} options - Opções de notificação
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function notify(options = {}) {
    const { duration = 1000, tone = 0, color = 0, showMessage = 0 } = options;

    try {
        if (!connectedDevice) {
            throw new Error('Nenhum dispositivo conectado');
        }

        const endpoint = getCommandEndpoint('Notify');

        const response = await toletusClient.post(
            `${endpoint}?duration=${duration}&tone=${tone}&color=${color}&showMessage=${showMessage}`,
            connectedDevice  // Device obrigatório no body
        );

        return response.data.response?.success !== false;
    } catch (error) {
        logger.error('Erro ao enviar notificação', { error: error.message });
        throw error;
    }
}

/**
 * Configura endpoint do webhook na catraca
 * @param {string} webhookUrl - URL do webhook
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function setWebhookEndpoint(webhookUrl) {
    try {
        logger.info('Configurando webhook', { webhookUrl });

        const response = await toletusClient.post(
            `/Webhook/SetEndpoint?endpoint=${encodeURIComponent(webhookUrl)}`
        );

        logger.info('Webhook configurado com sucesso');
        return true;
    } catch (error) {
        logger.error('Erro ao configurar webhook', { error: error.message });
        throw error;
    }
}

/**
 * Determina o endpoint correto baseado no tipo de dispositivo
 * @param {string} command - Nome do comando
 * @returns {string} Endpoint completo
 */
function getCommandEndpoint(command) {
    if (!connectedDevice) {
        return `/BasicCommonCommands/${command}`;
    }

    const typeMap = {
        0: 'LiteNet1Commands',
        1: 'LiteNet2Commands',
        2: 'LiteNet3Commands',
        3: 'SM25Commands'
    };

    const controller = typeMap[connectedDevice.type] || 'BasicCommonCommands';
    return `/${controller}/${command}`;
}

/**
 * Retorna o dispositivo atualmente conectado
 * @returns {Object|null} Dispositivo conectado ou null
 */
function getConnectedDevice() {
    return connectedDevice;
}

/**
 * Verifica se há dispositivo conectado
 * @returns {boolean} True se conectado
 */
function isConnected() {
    return connectedDevice !== null && connectedDevice.connected;
}

/**
 * Obtém as interfaces de rede disponíveis
 * @returns {Promise<Array>} Lista de redes
 */
async function getNetworks() {
    try {
        logger.info('Buscando interfaces de rede...');
        const response = await toletusClient.get('/DeviceConnection/GetNetworks');

        if (response.data.success) {
            logger.info('Redes encontradas', { count: response.data.data?.length || 0 });
            return response.data.data || [];
        }

        return [];
    } catch (error) {
        logger.error('Erro ao buscar redes', { error: error.message });
        throw error;
    }
}

module.exports = {
    discoverDevices,
    connect,
    disconnect,
    getDevices,
    releaseEntry,
    releaseExit,
    notify,
    setWebhookEndpoint,
    getConnectedDevice,
    isConnected,
    getNetworks
};
