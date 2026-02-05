const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
const webhookRouter = require('./routes/webhook');
const configRouter = require('./routes/config');
const toletusApi = require('./services/toletusApi');

const app = express();

// Habilitar CORS para o dashboard
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing JSON
app.use(express.json());

// Middleware de log para todas as requisições
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
});

// Rotas
app.use('/webhook', webhookRouter);
app.use('/api/config', configRouter);


// Health check
app.get('/health', (req, res) => {
    const device = toletusApi.getConnectedDevice();

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        catraca: {
            connected: toletusApi.isConnected(),
            device: device ? {
                id: device.id,
                name: device.name,
                ip: device.ip
            } : null
        }
    });
});

// Status do sistema
app.get('/status', async (req, res) => {
    try {
        const devices = await toletusApi.getDevices();
        const connectedDevice = toletusApi.getConnectedDevice();

        res.json({
            middleware: {
                status: 'running',
                port: config.port,
                webhookEndpoint: `http://localhost:${config.port}/webhook`
            },
            toletus: {
                hubUrl: config.toletus.hubUrl,
                devices: devices.map(d => ({
                    id: d.id,
                    name: d.name,
                    ip: d.ip,
                    connected: d.connected
                })),
                activeDevice: connectedDevice ? {
                    id: connectedDevice.id,
                    name: connectedDevice.name,
                    ip: connectedDevice.ip
                } : null
            },
            emusys: {
                apiUrl: config.emusys.apiUrl,
                configured: !!config.emusys.apiKey && config.emusys.apiKey !== 'sua_api_key_aqui'
            }
        });
    } catch (error) {
        logger.error('Erro ao obter status', { error: error.message });
        res.status(500).json({ error: 'Erro ao obter status' });
    }
});

// Conectar à catraca manualmente
app.post('/connect', async (req, res) => {
    try {
        const { ip, type } = req.body;
        const device = await toletusApi.connect(
            ip || config.toletus.catracaIp,
            type !== undefined ? type : config.toletus.catracaType
        );

        res.json({
            success: true,
            message: 'Conectado com sucesso',
            device
        });
    } catch (error) {
        logger.error('Erro ao conectar', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Desconectar da catraca
app.post('/disconnect', async (req, res) => {
    try {
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

// Configurar webhook na catraca
app.post('/setup-webhook', async (req, res) => {
    try {
        const webhookUrl = req.body.url || `http://localhost:${config.port}/webhook`;
        await toletusApi.setWebhookEndpoint(webhookUrl);

        res.json({
            success: true,
            message: 'Webhook configurado',
            webhookUrl
        });
    } catch (error) {
        logger.error('Erro ao configurar webhook', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Testar liberação manual
app.post('/test/release-entry', async (req, res) => {
    try {
        const message = req.body.message || 'Teste de liberação';
        await toletusApi.releaseEntry(message);

        res.json({
            success: true,
            message: 'Entrada liberada'
        });
    } catch (error) {
        logger.error('Erro no teste de liberação', { error: error.message });
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
    logger.error('Erro não tratado', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização
async function inicializar() {
    try {
        // Descobrir dispositivos
        logger.info('Descobrindo dispositivos...');
        const devices = await toletusApi.discoverDevices();

        if (devices.length > 0) {
            logger.info(`Encontrados ${devices.length} dispositivo(s)`);

            // Tentar conectar ao dispositivo configurado
            try {
                await toletusApi.connect();
                logger.info('Catraca conectada automaticamente');

                // Configurar webhook
                const webhookUrl = `http://localhost:${config.port}/webhook`;
                await toletusApi.setWebhookEndpoint(webhookUrl);
                logger.info('Webhook configurado', { url: webhookUrl });
            } catch (connError) {
                logger.warn('Não foi possível conectar automaticamente', {
                    error: connError.message
                });
            }
        } else {
            logger.warn('Nenhum dispositivo encontrado na rede');
        }
    } catch (error) {
        logger.error('Erro na inicialização', { error: error.message });
    }
}

// Iniciar servidor
app.listen(config.port, async () => {
    logger.info(`Servidor iniciado na porta ${config.port}`);
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║         🚪 Catraca Middleware - Emusys Integration        ║
╠═══════════════════════════════════════════════════════════╣
║  Servidor rodando em http://localhost:${config.port.toString().padEnd(4)}                ║
║  Webhook endpoint: http://localhost:${config.port}/webhook${' '.repeat(Math.max(0, 11 - config.port.toString().length))}║
║  Health check: http://localhost:${config.port}/health${' '.repeat(Math.max(0, 14 - config.port.toString().length))}║
╚═══════════════════════════════════════════════════════════╝
  `);

    // Inicializar conexão com catraca
    await inicializar();
});
