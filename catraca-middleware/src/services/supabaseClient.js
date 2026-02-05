const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const logger = require('../logger');

// Cliente Supabase (será null se não configurado)
let supabase = null;

/**
 * Inicializa o cliente Supabase
 * @returns {boolean} True se configurado com sucesso
 */
function inicializar() {
    const supabaseUrl = config.supabase.url;
    const supabaseKey = config.supabase.anonKey;

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl === 'sua_supabase_url' ||
        supabaseKey === 'sua_anon_key') {
        logger.warn('Supabase não configurado - logs de acesso desativados');
        return false;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
    logger.info('Supabase conectado com sucesso');
    return true;
}

/**
 * Registra uma entrada/saída no histórico
 * @param {Object} dados - Dados do acesso
 * @returns {Promise<Object|null>} Registro criado ou null
 */
async function registrarAcesso(dados) {
    if (!supabase) {
        logger.debug('Supabase não configurado, pulando registro de acesso');
        return null;
    }

    try {
        const registro = {
            pessoa_id: dados.pessoaId,
            pessoa_nome: dados.nome,
            token: dados.token,
            tipo: dados.tipo || 'entrada', // 'entrada' | 'saida'
            liberado: dados.liberado,
            motivo_bloqueio: dados.motivoBloqueio || null,
            curso: dados.curso || null,
            professor: dados.professor || null,
            horario_aula: dados.horarioAula || null,
            catraca_ip: dados.catracaIp || null,
            catraca_id: dados.catracaId || null,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('acessos')
            .insert([registro])
            .select()
            .single();

        if (error) {
            logger.error('Erro ao registrar acesso no Supabase', {
                error: error.message,
                code: error.code
            });
            return null;
        }

        logger.info('Acesso registrado no Supabase', { id: data.id });
        return data;
    } catch (error) {
        logger.error('Erro ao registrar acesso', { error: error.message });
        return null;
    }
}

/**
 * Busca histórico de acessos de uma pessoa
 * @param {number} pessoaId - ID da pessoa
 * @param {number} limite - Quantidade de registros
 * @returns {Promise<Array>} Lista de acessos
 */
async function buscarHistorico(pessoaId, limite = 10) {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('acessos')
            .select('*')
            .eq('pessoa_id', pessoaId)
            .order('created_at', { ascending: false })
            .limit(limite);

        if (error) {
            logger.error('Erro ao buscar histórico', { error: error.message });
            return [];
        }

        return data || [];
    } catch (error) {
        logger.error('Erro ao buscar histórico', { error: error.message });
        return [];
    }
}

/**
 * Busca acessos do dia atual
 * @param {string} tipo - Tipo de acesso ('entrada' | 'saida' | null para todos)
 * @returns {Promise<Array>} Lista de acessos
 */
async function buscarAcessosHoje(tipo = null) {
    if (!supabase) return [];

    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        let query = supabase
            .from('acessos')
            .select('*')
            .gte('created_at', hoje.toISOString())
            .order('created_at', { ascending: false });

        if (tipo) {
            query = query.eq('tipo', tipo);
        }

        const { data, error } = await query;

        if (error) {
            logger.error('Erro ao buscar acessos de hoje', { error: error.message });
            return [];
        }

        return data || [];
    } catch (error) {
        logger.error('Erro ao buscar acessos de hoje', { error: error.message });
        return [];
    }
}

/**
 * Conta acessos por período
 * @param {Date} dataInicio - Data inicial
 * @param {Date} dataFim - Data final
 * @returns {Promise<Object>} Contagem de acessos
 */
async function contarAcessos(dataInicio, dataFim) {
    if (!supabase) return { entradas: 0, saidas: 0, bloqueios: 0 };

    try {
        const { data, error } = await supabase
            .from('acessos')
            .select('tipo, liberado')
            .gte('created_at', dataInicio.toISOString())
            .lte('created_at', dataFim.toISOString());

        if (error) {
            logger.error('Erro ao contar acessos', { error: error.message });
            return { entradas: 0, saidas: 0, bloqueios: 0 };
        }

        const contagem = {
            entradas: data.filter(a => a.tipo === 'entrada' && a.liberado).length,
            saidas: data.filter(a => a.tipo === 'saida').length,
            bloqueios: data.filter(a => !a.liberado).length
        };

        return contagem;
    } catch (error) {
        logger.error('Erro ao contar acessos', { error: error.message });
        return { entradas: 0, saidas: 0, bloqueios: 0 };
    }
}

/**
 * Verifica se o Supabase está configurado
 * @returns {boolean} True se configurado
 */
function isConfigurado() {
    return supabase !== null;
}

module.exports = {
    inicializar,
    registrarAcesso,
    buscarHistorico,
    buscarAcessosHoje,
    contarAcessos,
    isConfigurado
};
