const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');
const logger = require('../logger');

/**
 * POST /webhook
 * Endpoint que recebe eventos da catraca Toletus
 */
router.post('/', async (req, res) => {
    const startTime = Date.now();

    logger.info('Webhook recebido', {
        body: req.body,
        headers: {
            'content-type': req.headers['content-type'],
            'user-agent': req.headers['user-agent']
        }
    });

    try {
        // Processar evento
        const resultado = await accessController.processarIdentificacao(req.body);

        const tempoTotal = Date.now() - startTime;

        logger.info('Webhook processado', {
            liberado: resultado.liberado,
            tempoMs: tempoTotal
        });

        // Responder para a catraca
        res.json({
            success: resultado.liberado,
            message: resultado.mensagem || (resultado.liberado ? 'OK' : 'Negado'),
            data: resultado.liberado ? resultado : null
        });

    } catch (error) {
        logger.error('Erro no webhook', { error: error.message });

        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

/**
 * GET /webhook/health
 * Health check do webhook
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
