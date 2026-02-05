# 🚪 Catraca Middleware - Integração Emusys

Middleware Node.js para integração entre catracas Toletus e o ERP Emusys.

## 📋 Funcionalidades

- ✅ Recebe eventos de identificação da catraca (webhook)
- ✅ Valida acesso no Emusys (inadimplência, contrato, agendamento)
- ✅ Libera ou bloqueia entrada na catraca
- ✅ Registra presença de alunos
- ✅ Logs detalhados de todas as operações

## 🚀 Instalação

```bash
cd catraca-middleware
npm install
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
# Servidor
PORT=3000

# Emusys API
EMUSYS_API_URL=https://api.emusys.com.br/v1
EMUSYS_API_KEY=sua_api_key_aqui

# Toletus HUB
TOLETUS_HUB_URL=https://localhost:7067
CATRACA_IP=192.168.1.100
CATRACA_TYPE=3

# Supabase (logs de acesso)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### Tipos de dispositivo:
- `0` = LiteNet1
- `1` = LiteNet2
- `2` = LiteNet3
- `3` = SM25

### Configuração do Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Execute o SQL em `sql/create_acessos_table.sql` no SQL Editor
3. Copie a URL e Anon Key do projeto para o `.env`

## 🏃 Execução

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

## 📡 Endpoints

### Health Check
```
GET /health
```

### Status do Sistema
```
GET /status
```

### Webhook (recebe eventos da catraca)
```
POST /webhook
Body: { token: "ABC123" } ou { pessoaId: 123 }
```

### Conectar à Catraca
```
POST /connect
Body: { ip: "192.168.1.100", type: 3 }
```

### Desconectar
```
POST /disconnect
```

### Configurar Webhook na Catraca
```
POST /setup-webhook
Body: { url: "http://localhost:3000/webhook" }
```

### Testar Liberação Manual
```
POST /test/release-entry
Body: { message: "Teste" }
```

## 🔄 Fluxo de Funcionamento

1. **Aluno chega na catraca** e faz reconhecimento (facial, cartão, etc)
2. **Catraca envia evento** via webhook para o middleware
3. **Middleware consulta Emusys**:
   - Identifica pessoa pelo token
   - Valida inadimplência
   - Valida agendamento de aula
4. **Middleware responde**:
   - ✅ OK → Libera entrada + exibe nome
   - ❌ Erro → Bloqueia + exibe mensagem
5. **Presença registrada** automaticamente no Emusys

## 📁 Estrutura do Projeto

```
catraca-middleware/
├── package.json
├── .env
├── src/
│   ├── index.js              # Servidor Express
│   ├── config.js             # Configurações
│   ├── logger.js             # Winston logger
│   ├── routes/
│   │   └── webhook.js        # Rota do webhook
│   ├── services/
│   │   ├── emusysApi.js      # Cliente Emusys
│   │   └── toletusApi.js     # Cliente Toletus
│   └── controllers/
│       └── accessController.js
└── logs/                     # Arquivos de log
```

## 📝 Logs

Os logs são salvos em:
- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros
- `logs/access.log` - Registros de acesso

## ⚠️ Pendências

### Verificar com Toletus:
- Formato exato do payload do webhook
- Qual campo identifica o aluno (token, id, cpf?)

### Verificar com Emusys:
- Endpoint para verificação de contrato (se existir)
