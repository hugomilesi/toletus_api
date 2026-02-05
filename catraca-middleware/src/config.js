require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,

    emusys: {
        apiUrl: process.env.EMUSYS_API_URL || 'https://api.emusys.com.br/v1',
        apiKey: process.env.EMUSYS_API_KEY || ''
    },

    toletus: {
        hubUrl: process.env.TOLETUS_HUB_URL || 'https://localhost:7067',
        catracaIp: process.env.CATRACA_IP || '192.168.1.100',
        catracaType: parseInt(process.env.CATRACA_TYPE) || 3
    },

    supabase: {
        url: process.env.SUPABASE_URL || 'sua_supabase_url',
        anonKey: process.env.SUPABASE_ANON_KEY || 'sua_anon_key'
    },

    logLevel: process.env.LOG_LEVEL || 'info'
};
