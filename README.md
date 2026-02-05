# Sistema de Controle de Acesso - LA Music

Sistema de integração entre Catraca Toletus e Emusys ERP.

## Pre-requisitos

Antes de executar, instale:

1. **Node.js** (v18+): https://nodejs.org
2. **.NET SDK 9**: https://dotnet.microsoft.com/download

## Instalacao Rapida

### Windows

1. Baixe ou clone este repositorio
2. Baixe o Toletus HUB:
   ```
   https://github.com/Toletus/hub/archive/refs/heads/main.zip
   ```
3. Extraia o Toletus HUB na pasta `toletus-hub/`
4. Execute `iniciar-sistema.bat`

### Manual (3 terminais)

```bash
# Terminal 1: Toletus HUB
cd toletus-hub/src/Toletus.Hub.API
dotnet run

# Terminal 2: Middleware
cd catraca-middleware
npm install
npm start

# Terminal 3: Dashboard
cd dashboard
npm install
npm run dev
```

5. Acesse: http://localhost:5173

## Estrutura do Projeto

```
toletus_api/
├── catraca-middleware/    # Backend Node.js (API)
├── dashboard/             # Frontend React (Interface)
├── toletus-hub/           # Controle da catraca (.NET) - baixar separado
├── docs/                  # Documentacao
├── iniciar-sistema.bat    # Script para iniciar tudo
└── README.md
```

## Configuracao

### Arquivo `.env` (catraca-middleware/)

```env
PORT=3000
TOLETUS_HUB_URL=http://localhost:5110
CATRACA_IP=192.168.1.100
CATRACA_TYPE=3
EMUSYS_API_URL=https://api.emusys.com.br/v1
EMUSYS_API_KEY=sua_api_key_aqui
SUPABASE_URL=https://rwmvujhybdpbygkbwiki.supabase.co
SUPABASE_ANON_KEY=sua_key_aqui
```

### Tipos de Catraca

- `CATRACA_TYPE=0` → LiteNet1
- `CATRACA_TYPE=1` → LiteNet2
- `CATRACA_TYPE=2` → LiteNet3
- `CATRACA_TYPE=3` → SM25

## Uso

1. Abra http://localhost:5173
2. Clique em **Configurar**
3. Clique em **Buscar** para descobrir catracas na rede
4. Selecione a catraca e clique em **Conectar**
5. Use **Testar Entrada** para verificar se funciona

## Endpoints da API

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /api/config/networks | Lista redes disponiveis |
| GET | /api/config/discover | Descobre catracas |
| GET | /api/config/status | Status da conexao |
| POST | /api/config/connect | Conecta a uma catraca |
| POST | /api/config/disconnect | Desconecta |
| POST | /api/config/test | Testa liberacao |
| POST | /api/config/webhook | Configura webhook |

## Suporte

- Documentacao Toletus: https://github.com/Toletus/hub
- Documentacao Emusys: https://emusys.gitbook.io/emusys/api-emusys
