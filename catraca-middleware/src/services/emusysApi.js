const axios = require('axios');
const config = require('../config');
const logger = require('../logger');

// Cliente HTTP para Emusys com configuração base
const emusysClient = axios.create({
    baseURL: config.emusys.apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.emusys.apiKey}`
    }
});

/**
 * Identifica uma pessoa pelo token
 * @param {string} token - Token de identificação
 * @param {boolean} somenteAtivos - Retornar apenas alunos/responsáveis ativos
 * @returns {Promise<Object>} Dados da pessoa
 */
async function identificarPorToken(token, somenteAtivos = true) {
    try {
        logger.info('Identificando pessoa por token', { token: token.substring(0, 4) + '***' });

        const response = await emusysClient.post('/controle_de_acesso/identificar', {
            token,
            somenteAlunosOuResponsaveisAtivos: somenteAtivos
        });

        logger.info('Pessoa identificada com sucesso', {
            pessoaId: response.data.id,
            nome: response.data.nome
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            logger.warn('Token não encontrado', { token: token.substring(0, 4) + '***' });
            return null;
        }
        logger.error('Erro ao identificar pessoa', { error: error.message });
        throw error;
    }
}

/**
 * Registra presença de uma pessoa
 * @param {number} pessoaId - ID da pessoa
 * @param {string} token - Token opcional
 * @param {boolean} permitirInadimplente - Permitir acesso mesmo com inadimplência
 * @returns {Promise<Object>} Resultado do registro
 */
async function registrarPresenca(pessoaId, token = null, permitirInadimplente = false) {
    try {
        logger.info('Registrando presença', { pessoaId, permitirInadimplente });

        const body = {
            id: pessoaId,
            permitirInadimplente
        };

        if (token) {
            body.token = token;
        }

        const response = await emusysClient.post('/controle_de_acesso/registrar_presenca', body);

        logger.info('Presença registrada com sucesso', {
            pessoaId,
            curso: response.data.curso,
            horarioAula: response.data.horarioAula
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response?.status === 400) {
            const errorData = error.response.data;
            logger.warn('Erro de regra de negócio ao registrar presença', {
                pessoaId,
                codigo: errorData.codigo,
                mensagem: errorData.mensagem
            });

            return {
                success: false,
                codigo: errorData.codigo,
                mensagem: errorData.mensagem
            };
        }

        logger.error('Erro ao registrar presença', { error: error.message });
        throw error;
    }
}

/**
 * Lista pessoas cadastradas
 * @param {boolean} somenteComToken - Retornar apenas pessoas com token
 * @param {string} busca - Termo de busca pelo nome
 * @returns {Promise<Array>} Lista de pessoas
 */
async function listarPessoas(somenteComToken = false, busca = '') {
    try {
        const params = new URLSearchParams();
        if (somenteComToken) params.append('somenteComToken', 'true');
        if (busca) params.append('busca', busca);

        const response = await emusysClient.get(`/controle_de_acesso/pessoas?${params}`);

        logger.info('Pessoas listadas', { quantidade: response.data.pessoas?.length || 0 });

        return response.data.pessoas || [];
    } catch (error) {
        logger.error('Erro ao listar pessoas', { error: error.message });
        throw error;
    }
}

/**
 * Cadastra ou atualiza token de uma pessoa
 * @param {number} pessoaId - ID da pessoa
 * @param {string} token - Novo token
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function cadastrarToken(pessoaId, token) {
    try {
        logger.info('Cadastrando token', { pessoaId });

        await emusysClient.post('/controle_de_acesso/token', {
            id: pessoaId,
            token
        });

        logger.info('Token cadastrado com sucesso', { pessoaId });
        return true;
    } catch (error) {
        logger.error('Erro ao cadastrar token', { pessoaId, error: error.message });
        throw error;
    }
}

/**
 * Remove token de uma pessoa
 * @param {number} pessoaId - ID da pessoa
 * @returns {Promise<boolean>} Sucesso da operação
 */
async function removerToken(pessoaId) {
    try {
        logger.info('Removendo token', { pessoaId });

        await emusysClient.delete('/controle_de_acesso/token', {
            data: { id: pessoaId }
        });

        logger.info('Token removido com sucesso', { pessoaId });
        return true;
    } catch (error) {
        logger.error('Erro ao remover token', { pessoaId, error: error.message });
        throw error;
    }
}

module.exports = {
    identificarPorToken,
    registrarPresenca,
    listarPessoas,
    cadastrarToken,
    removerToken
};
