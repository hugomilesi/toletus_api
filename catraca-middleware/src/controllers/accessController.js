const emusysApi = require('../services/emusysApi');
const toletusApi = require('../services/toletusApi');
const supabaseClient = require('../services/supabaseClient');
const logger = require('../logger');

/**
 * Processa evento de identificação da catraca
 * Chamado quando a catraca reconhece uma pessoa (facial, cartão, etc)
 * 
 * @param {Object} evento - Dados do evento da catraca
 * @returns {Promise<Object>} Resultado do processamento
 */
async function processarIdentificacao(evento) {
    const startTime = Date.now();

    logger.info('Processando evento de identificação', { evento });

    try {
        // 1. Extrair informações do evento
        // TODO: Ajustar conforme formato real do webhook Toletus
        const { token, pessoaId, tipo } = extrairDadosEvento(evento);

        if (!token && !pessoaId) {
            logger.warn('Evento sem identificação válida');
            return {
                liberado: false,
                mensagem: 'Identificação inválida',
                codigo: 'IDENTIFICACAO_INVALIDA'
            };
        }

        // 2. Identificar pessoa no Emusys (se só temos token)
        let pessoa = null;
        let idParaRegistro = pessoaId;

        if (token && !pessoaId) {
            pessoa = await emusysApi.identificarPorToken(token);

            if (!pessoa) {
                logger.warn('Token não encontrado no Emusys', { token: maskToken(token) });
                await negarAcesso('Token não cadastrado');
                return {
                    liberado: false,
                    mensagem: 'Token não cadastrado',
                    codigo: 'TOKEN_NAO_ENCONTRADO'
                };
            }

            idParaRegistro = pessoa.id;
        }

        // 3. Tentar registrar presença (isso valida inadimplência, contrato, etc)
        const resultadoPresenca = await emusysApi.registrarPresenca(
            idParaRegistro,
            token,
            false // não permitir inadimplente
        );

        // 4. Processar resultado
        if (resultadoPresenca.success) {
            // Liberar entrada
            const nomePessoa = resultadoPresenca.data.pessoa?.nome || pessoa?.nome || 'Visitante';
            await liberarAcesso(nomePessoa);

            const tempoProcessamento = Date.now() - startTime;

            logger.info('Acesso liberado', {
                pessoaId: idParaRegistro,
                nome: nomePessoa,
                curso: resultadoPresenca.data.curso,
                tempoMs: tempoProcessamento
            });

            // Registrar acesso no Supabase
            await supabaseClient.registrarAcesso({
                pessoaId: idParaRegistro,
                nome: nomePessoa,
                token: token,
                tipo: 'entrada',
                liberado: true,
                curso: resultadoPresenca.data.curso,
                professor: resultadoPresenca.data.professor,
                horarioAula: resultadoPresenca.data.horarioAula,
                catracaIp: toletusApi.getConnectedDevice()?.ip,
                catracaId: toletusApi.getConnectedDevice()?.id
            });

            return {
                liberado: true,
                pessoa: resultadoPresenca.data.pessoa,
                aula: {
                    horario: resultadoPresenca.data.horarioAula,
                    curso: resultadoPresenca.data.curso,
                    professor: resultadoPresenca.data.professor
                }
            };
        } else {
            // Negar entrada com mensagem específica
            const mensagemNegacao = obterMensagemNegacao(resultadoPresenca.codigo);
            await negarAcesso(mensagemNegacao);

            logger.warn('Acesso negado', {
                pessoaId: idParaRegistro,
                codigo: resultadoPresenca.codigo,
                mensagem: resultadoPresenca.mensagem
            });

            // Registrar bloqueio no Supabase
            await supabaseClient.registrarAcesso({
                pessoaId: idParaRegistro,
                nome: pessoa?.nome,
                token: token,
                tipo: 'entrada',
                liberado: false,
                motivoBloqueio: resultadoPresenca.codigo,
                catracaIp: toletusApi.getConnectedDevice()?.ip,
                catracaId: toletusApi.getConnectedDevice()?.id
            });

            return {
                liberado: false,
                codigo: resultadoPresenca.codigo,
                mensagem: resultadoPresenca.mensagem
            };
        }

    } catch (error) {
        logger.error('Erro ao processar identificação', {
            error: error.message,
            stack: error.stack
        });

        // Em caso de erro, negar acesso por segurança
        await negarAcesso('Erro no sistema');

        return {
            liberado: false,
            mensagem: 'Erro interno',
            codigo: 'ERRO_INTERNO'
        };
    }
}

/**
 * Extrai dados do evento da catraca
 * TODO: Ajustar conforme documentação real do webhook Toletus
 * 
 * @param {Object} evento - Evento bruto da catraca
 * @returns {Object} Dados extraídos
 */
function extrairDadosEvento(evento) {
    // Possíveis formatos do evento (verificar com Toletus):
    // { token: "ABC123" }
    // { id: 123, tag: "ABC123" }
    // { pessoaId: 123 }
    // { identification: { type: "facial", id: "123" } }

    return {
        token: evento.token || evento.tag || evento.identification?.id || null,
        pessoaId: evento.pessoaId || evento.id || null,
        tipo: evento.tipo || evento.type || 'desconhecido'
    };
}

/**
 * Libera acesso na catraca
 * @param {string} mensagem - Mensagem a exibir
 */
async function liberarAcesso(mensagem) {
    try {
        if (toletusApi.isConnected()) {
            await toletusApi.releaseEntry(mensagem);
        } else {
            logger.warn('Catraca não conectada para liberar acesso');
        }
    } catch (error) {
        logger.error('Erro ao liberar catraca', { error: error.message });
    }
}

/**
 * Nega acesso na catraca
 * @param {string} mensagem - Mensagem a exibir
 */
async function negarAcesso(mensagem) {
    try {
        if (toletusApi.isConnected()) {
            // Notificar com beep de erro (tom 1 = erro, cor 2 = vermelho)
            await toletusApi.notify({
                duration: 2000,
                tone: 1,
                color: 2,
                showMessage: 1
            });
        }
    } catch (error) {
        logger.error('Erro ao negar acesso na catraca', { error: error.message });
    }
}

/**
 * Retorna mensagem amigável para o código de erro
 * @param {string} codigo - Código de erro do Emusys
 * @returns {string} Mensagem para exibir
 */
function obterMensagemNegacao(codigo) {
    const mensagens = {
        'PESSOA_INADIMPLENTE': 'Pendência financeira',
        'DEPENDENTE_INADIMPLENTE': 'Pendência dependente',
        'SEM_AGENDAMENTO_ATUAL': 'Sem aula agendada',
        'TOKEN_E_ID_NAO_CORRESPONDEM': 'Token inválido'
    };

    return mensagens[codigo] || 'Acesso negado';
}

/**
 * Mascara token para log
 * @param {string} token - Token original
 * @returns {string} Token mascarado
 */
function maskToken(token) {
    if (!token || token.length < 4) return '***';
    return token.substring(0, 4) + '***';
}

module.exports = {
    processarIdentificacao
};
