const winston = require('winston');
const config = require('./config');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'catraca-middleware' },
    transports: [
        // Console colorido para desenvolvimento
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, ...meta }) => {
                    const metaStr = Object.keys(meta).length > 1
                        ? JSON.stringify(meta, null, 2)
                        : '';
                    return `${timestamp} [${level}]: ${message} ${metaStr}`;
                })
            )
        }),
        // Arquivo de logs gerais
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Arquivo separado para erros
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        // Arquivo separado para acessos
        new winston.transports.File({
            filename: path.join(logsDir, 'access.log'),
            maxsize: 5242880,
            maxFiles: 10
        })
    ]
});

module.exports = logger;
