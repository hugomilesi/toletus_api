require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,

    emusys: {
        apiUrl: process.env.EMUSYS_API_URL || 'https://api.emusys.com.br/v1',
        apiKey: process.env.EMUSYS_API_KEY || ''
    },

    toletus: {
        hubUrl: process.env.TOLETUS_HUB_URL || 'http://localhost:5110',
        catracaIp: process.env.CATRACA_IP || '192.168.1.100',
        catracaType: parseInt(process.env.CATRACA_TYPE) || 3
    },

    logLevel: process.env.LOG_LEVEL || 'info'
};
