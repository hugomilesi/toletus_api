/**
 * Rotas de Configuração da Catraca
 * Endpoints para gerenciar conexão, descoberta e configuração
 */

const express = require('express');
const router = express.Router();
const toletusApi = require('../services/toletusApi');
const logger = require('../logger');

/**
 * GET /api/config/networks
 * Lista as interfaces de rede disponíveis
 */
router.get('/networks', async (req, res) => {
    try {
        logger.info('Buscando redes disponíveis...');
        const networks = await toletusApi.getNetworks();

        res.json({
            success: true,
            data: networks
        });
    } catch (error) {
        logger.error('Erro ao buscar redes', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/config/discover
 * Descobre dispositivos na rede especificada
 */
router.get('/discover', async (req, res) => {
    try {
        const { network } = req.query;
        logger.info('Descobrindo dispositivos...', { network });

        const devices = await toletusApi.discoverDevices(network);

        res.json({
            success: true,
            data: devices,
            count: devices.length
        });
    } catch (error) {
        logger.error('Erro ao descobrir dispositivos', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/config/status
 * Retorna o status atual da conexão com a catraca
 */
router.get('/status', async (req, res) => {
    try {
        const device = toletusApi.getConnectedDevice();
        const isConnected = toletusApi.isConnected();

        res.json({
            success: true,
            data: {
                connected: isConnected,
                device: device ? {
                    id: device.id,
                    name: device.name,
                    ip: device.ip,
                    type: device.type,
                    typeName: getTypeName(device.type)
                } : null
            }
        });
    } catch (error) {
        logger.error('Erro ao obter status', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/config/connect
 * Conecta a um dispositivo específico
 */
router.post('/connect', async (req, res) => {
    try {
        const { ip, type } = req.body;

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: 'IP do dispositivo é obrigatório'
            });
        }

        logger.info('Conectando ao dispositivo...', { ip, type });
        const device = await toletusApi.connect(ip, type);

        res.json({
            success: true,
            message: 'Conectado com sucesso',
            data: {
                id: device.id,
                name: device.name,
                ip: device.ip,
                type: device.type,
                typeName: getTypeName(device.type)
            }
        });
    } catch (error) {
        logger.error('Erro ao conectar', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/config/disconnect
 * Desconecta do dispositivo atual
 */
router.post('/disconnect', async (req, res) => {
    try {
        logger.info('Desconectando do dispositivo...');
        await toletusApi.disconnect();

        res.json({
            success: true,
            message: 'Desconectado com sucesso'
        });
    } catch (error) {
        logger.error('Erro ao desconectar', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/config/test
 * Testa a liberação de entrada na catraca
 */
router.post('/test', async (req, res) => {
    try {
        const { message = 'Teste OK!' } = req.body;

        logger.info('Testando liberação de entrada...', { message });
        const result = await toletusApi.releaseEntry(message);

        res.json({
            success: true,
            message: 'Teste executado com sucesso',
            result
        });
    } catch (error) {
        logger.error('Erro no teste', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * POST /api/config/webhook
 * Configura o endpoint do webhook na catraca
 */
router.post('/webhook', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL do webhook é obrigatória'
            });
        }

        logger.info('Configurando webhook...', { url });
        await toletusApi.setWebhookEndpoint(url);

        res.json({
            success: true,
            message: 'Webhook configurado com sucesso',
            data: { url }
        });
    } catch (error) {
        logger.error('Erro ao configurar webhook', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * GET /api/config/devices
 * Lista dispositivos já conhecidos/cacheados
 */
router.get('/devices', async (req, res) => {
    try {
        const devices = await toletusApi.getDevices();

        res.json({
            success: true,
            data: devices.map(d => ({
                id: d.id,
                name: d.name,
                ip: d.ip,
                type: d.type,
                typeName: getTypeName(d.type),
                connected: d.connected
            })),
            count: devices.length
        });
    } catch (error) {
        logger.error('Erro ao listar dispositivos', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * Retorna o nome legível do tipo de dispositivo
 */
function getTypeName(type) {
    const types = {
        0: 'LiteNet1',
        1: 'LiteNet2',
        2: 'LiteNet3',
        3: 'SM25'
    };
    return types[type] || 'Desconhecido';
}

module.exports = router;
