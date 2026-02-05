# 🚪 Sistema de Controle de Acesso - Catraca

Sistema de integração entre Catraca Toletus e Emusys ERP usando Supabase.

## 📋 Arquitetura

```
Catraca Toletus
       ↓ (webhook)
Supabase Edge Function
       ↓
   Emusys API (validação)
       ↓
   Supabase DB (registro)
       ↓
Resposta (libera/bloqueia)
```

## 🔧 Configuração

### 1. Supabase (Já configurado ✓)

**Projeto:** `catraca_music`  
**URL:** `https://rwmvujhybdpbygkbwiki.supabase.co`

**Tabela `acessos`:** ✓ Criada  
**Edge Function:** ✓ Deployada

### 2. Configurar Secrets no Supabase

Acesse: [Supabase Dashboard](https://supabase.com/dashboard/project/rwmvujhybdpbygkbwiki/settings/functions) > Edge Functions > Secrets

Adicione:
- `EMUSYS_API_URL` = `https://api.emusys.com.br/v1`
- `EMUSYS_API_KEY` = `sua_chave_api_emusys`

### 3. Configurar Webhook na Catraca

No Toletus HUB, configure o endpoint do webhook:

```
POST https://localhost:7067/Webhook/SetEndpoint?endpoint=https://rwmvujhybdpbygkbwiki.supabase.co/functions/v1/webhook-catraca
```

Ou use a interface do Toletus para configurar:
```
https://rwmvujhybdpbygkbwiki.supabase.co/functions/v1/webhook-catraca
```

## 🧪 Testar o Webhook

### Via cURL:
```bash
curl -X POST https://rwmvujhybdpbygkbwiki.supabase.co/functions/v1/webhook-catraca \
  -H "Content-Type: application/json" \
  -d '{"token": "ABC123"}'
```

### Via PowerShell:
```powershell
Invoke-RestMethod -Uri "https://rwmvujhybdpbygkbwiki.supabase.co/functions/v1/webhook-catraca" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"token": "ABC123"}'
```

## 📊 Visualizar Acessos

Acesse o Supabase Dashboard:
```
https://supabase.com/dashboard/project/rwmvujhybdpbygkbwiki/editor
```

Selecione a tabela `acessos` para ver o histórico.

## 🔄 Fluxo de Funcionamento

1. **Aluno se identifica** na catraca (facial, cartão, etc)
2. **Catraca envia webhook** com token/ID para a Edge Function
3. **Edge Function consulta Emusys:**
   - Identifica pessoa pelo token
   - Valida inadimplência
   - Valida agendamento de aula
4. **Edge Function responde:**
   - ✅ **Liberado:** Registra presença + acesso no Supabase
   - ❌ **Bloqueado:** Registra bloqueio no Supabase
5. **Catraca libera ou bloqueia** baseado na resposta

## 📝 Estrutura da Tabela `acessos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `pessoa_id` | INTEGER | ID da pessoa no Emusys |
| `pessoa_nome` | TEXT | Nome da pessoa |
| `token` | TEXT | Token usado |
| `tipo` | TEXT | 'entrada' ou 'saida' |
| `liberado` | BOOLEAN | Se foi liberado |
| `motivo_bloqueio` | TEXT | Código do bloqueio |
| `curso` | TEXT | Curso da aula |
| `professor` | TEXT | Professor da aula |
| `horario_aula` | TIMESTAMPTZ | Horário da aula |
| `catraca_ip` | TEXT | IP da catraca |
| `catraca_id` | INTEGER | ID da catraca |
| `created_at` | TIMESTAMPTZ | Data/hora |

## ⚠️ Pendências

### Verificar com Toletus:
- [ ] Formato exato do payload do webhook
- [ ] Qual campo identifica o aluno (token, id, cpf?)
- [ ] A catraca aguarda resposta antes de liberar?

### Verificar com Emusys:
- [ ] Obter API Key de produção
- [ ] Confirmar endpoints de validação

## 🔗 Links Úteis

- [Supabase Dashboard](https://supabase.com/dashboard/project/rwmvujhybdpbygkbwiki)
- [Edge Functions Logs](https://supabase.com/dashboard/project/rwmvujhybdpbygkbwiki/functions/webhook-catraca)
- [Tabela Acessos](https://supabase.com/dashboard/project/rwmvujhybdpbygkbwiki/editor?table=acessos)

## 📞 Suporte

Para modificar a Edge Function, edite o código no Supabase Dashboard ou use o Supabase CLI.
