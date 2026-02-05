# Toletus HUB
<html><head></head><body></body></html>
---
## DeviceConnection
<h2 id="visão-geral">Visão Geral</h2>
<p>O <code>DeviceConnection</code> gerencia operações de rede e dispositivos no sistema Toletus Hub. Fornece endpoints para descobrir, listar e gerenciar conexões com dispositivos LiteNet (versões 1, 2 e 3).</p>
<h2 id="fluxo-de-integração-recomendado">Fluxo de Integração Recomendado</h2>
<p><strong>⚠️ IMPORTANTE:</strong> Antes de tentar conectar a qualquer dispositivo, é <strong>obrigatório</strong> realizar primeiro a descoberta dos dispositivos disponíveis através dos endpoints:</p>
<ul>
<li><p><code>DiscoverDevices</code> – para descobrir e atualizar a lista de dispositivos.</p>
</li>
<li><p><code>GetDevices</code> – alternativa ao DiscoverDevices, obtém dispositivos do cache ou realiza nova descoberta se necessário.</p>
</li>
</ul>
<h2 id="endpoints-disponíveis">Endpoints Disponíveis</h2>
<h3 id="1-getnetworks">1. GetNetworks</h3>
<ul>
<li><p><strong>Método:</strong> <code>GET</code></p>
</li>
<li><p><strong>Rota:</strong> <code>/GetNetworks</code></p>
</li>
<li><p><strong>Descrição:</strong> Retorna os nomes de todas as redes/interfaces disponíveis.</p>
</li>
<li><p><strong>Resposta:</strong> Lista de strings.</p>
</li>
<li><p><strong>Uso:</strong> Listar redes disponíveis antes da descoberta dos dispositivos.</p>
</li>
</ul>
<h3 id="2-getdefaultnetworkname">2. GetDefaultNetworkName</h3>
<ul>
<li><p><strong>Método:</strong> <code>GET</code></p>
</li>
<li><p><strong>Rota:</strong> <code>/GetDefaultNetworkName</code></p>
</li>
<li><p><strong>Descrição:</strong> Retorna o nome da rede padrão.</p>
</li>
<li><p><strong>Resposta:</strong> String com o nome da rede.</p>
</li>
<li><p><strong>Uso:</strong> Obter rede padrão para operações subsequentes.</p>
</li>
</ul>
<h3 id="3-discoverdevices">3. DiscoverDevices</h3>
<ul>
<li><p><strong>Método:</strong> <code>GET</code></p>
</li>
<li><p><strong>Rota:</strong> <code>/DiscoverDevices</code></p>
</li>
<li><p><strong>Descrição:</strong> <strong>[OBRIGATÓRIO]</strong> Descobre dispositivos disponíveis na rede especificada.</p>
</li>
<li><p><strong>Parâmetros:</strong></p>
<ul>
<li><code>network</code> (opcional): Nome da rede; rede padrão se não informado.</li>
</ul>
</li>
<li><p><strong>Resposta:</strong> <code>DeviceResponse</code> com lista de dispositivos.</p>
</li>
<li><p><strong>Uso:</strong> Popular o cache de dispositivos.</p>
</li>
</ul>
<h3 id="4-getdevices">4. GetDevices</h3>
<ul>
<li><p><strong>Método:</strong> <code>GET</code></p>
</li>
<li><p><strong>Rota:</strong> <code>/GetDevices</code></p>
</li>
<li><p><strong>Descrição:</strong> Alternativa ao DiscoverDevices; retorna dispositivos já descobertos ou realiza nova descoberta.</p>
</li>
<li><p><strong>Parâmetros:</strong></p>
<ul>
<li><code>network</code> (opcional): Nome da rede; rede padrão se não informado.</li>
</ul>
</li>
<li><p><strong>Resposta:</strong> <code>DeviceResponse</code> com lista de dispositivos.</p>
</li>
<li><p><strong>Uso:</strong> Alternativa rápida ao DiscoverDevices.</p>
</li>
</ul>
<h3 id="5-connect">5. Connect</h3>
<ul>
<li><p><strong>Método:</strong> <code>POST</code></p>
</li>
<li><p><strong>Rota:</strong> <code>/Connect</code></p>
</li>
<li><p><strong>Descrição:</strong> Conecta a um dispositivo específico.</p>
</li>
<li><p><strong>Parâmetros:</strong></p>
<ul>
<li><p><code>ip</code> (obrigatório): Endereço IP do dispositivo.</p>
</li>
<li><p><code>type</code> (obrigatório): Tipo do dispositivo (<code>LiteNet1</code>, <code>LiteNet2</code>, <code>LiteNet3</code>).</p>
</li>
<li><p><code>network</code> (opcional): Nome da rede.</p>
</li>
</ul>
</li>
<li><p><strong>Resposta:</strong> <code>DeviceResponse</code> com informações da conexão.</p>
</li>
<li><p><strong>Pré-requisito:</strong> Dispositivo já descoberto.</p>
</li>
</ul>
<h3 id="6-disconnect">6. Disconnect</h3>
<ul>
<li><p><strong>Método:</strong> <code>POST</code></p>
</li>
<li><p><strong>Rota:</strong> <code>/Disconnect</code></p>
</li>
<li><p><strong>Descrição:</strong> Desconecta de um dispositivo específico.</p>
</li>
<li><p><strong>Parâmetros:</strong></p>
<ul>
<li><p><code>ip</code> (obrigatório): Endereço IP do dispositivo.</p>
</li>
<li><p><code>type</code> (obrigatório): Tipo do dispositivo (<code>LiteNet1</code>, <code>LiteNet2</code>, <code>LiteNet3</code>).</p>
</li>
</ul>
</li>
<li><p><strong>Resposta:</strong> <code>DeviceResponse</code> com informações do dispositivo desconectado.</p>
</li>
</ul>
<h2 id="tipos-de-dispositivos-suportados">Tipos de Dispositivos Suportados</h2>
<ul>
<li><p><strong>LiteNet1:</strong> Primeira geração.</p>
</li>
<li><p><strong>LiteNet2:</strong> Segunda geração.</p>
</li>
<li><p><strong>LiteNet3:</strong> Terceira geração.</p>
</li>
</ul>
<h2 id="exemplo-de-fluxo-de-integração">Exemplo de Fluxo de Integração</h2>
<pre class="click-to-expand-wrapper is-snippet-wrapper"><code class="language-plaintext">1. GET /GetNetworks (opcional)
2. GET /DiscoverDevices?network=NomeRede (opcional)
3. POST /Connect { ip(obrigatório), type(obrigatório), network (opcional)}
4. [Operações com o dispositivo conectado]
5. POST /Disconnect { ip, type }

</code></pre>
<h2 id="tratamento-de-erros">Tratamento de Erros</h2>
<p>O sistema retorna mensagens específicas nos seguintes casos:</p>
<ul>
<li><p>Dispositivo não encontrado.</p>
</li>
<li><p>Dispositivo já conectado.</p>
</li>
<li><p>Dispositivo não conectado.</p>
</li>
<li><p>Rede não encontrada.</p>
</li>
</ul>
<h2 id="notas-importantes">Notas Importantes</h2>
<ul>
<li><p>Sempre execute a descoberta (<code>DiscoverDevices</code>) antes da conexão.</p>
</li>
<li><p>O sistema mantém cache dos dispositivos.</p>
</li>
<li><p>Comportamentos específicos podem variar conforme o tipo do dispositivo.</p>
</li>
<li><p>Se nenhuma rede for especificada, será usada a rede padrão.</p>
</li>
</ul>

### GetNetworks
**Method:** `GET`  
**URL:** ``
**Responses:**
#### 200 OK```json[
  "vEthernet (WSL (Hyper-V firewall))",
  "Conex\u00e3o Local* 9",
  "Conex\u00e3o Local* 10",
  "Wi-Fi",
  "Conex\u00e3o de Rede Bluetooth",
  "Ethernet",
  "Loopback Pseudo-Interface 1"
]```
---
### GetDefaultNetworkName
**Method:** `GET`  
**URL:** `https://localhost:7067/DeviceConnection/GetDefaultNetworkName`
**Responses:**
#### 200 OK```jsonWi-Fi```
---
### DiscoverDevices
**Method:** `GET`  
**URL:** `https://localhost:7067/DeviceConnection/DiscoverDevices`
**Responses:**
#### 200 OK```json{
  "success": true,
  "message": null,
  "data": [
    {
      "id": 62,
      "name": "LiteNet2 #62",
      "ip": "192.168.25.55",
      "port": 7878,
      "type": 1,
      "connected": false
    },
    {
      "id": 2,
      "name": "Edson #2",
      "ip": "192.168.25.2",
      "port": 7878,
      "type": 2,
      "connected": false
    }
  ]
}```
---
### GetDevices
**Method:** `GET`  
**URL:** `https://localhost:7067/DeviceConnection/GetDevices`
**Responses:**
#### 200 OK```json{
  "success": true,
  "message": null,
  "data": [
    {
      "id": 62,
      "name": "LiteNet2 #62",
      "ip": "192.168.25.55",
      "port": 7878,
      "type": 1,
      "connected": false
    },
    {
      "id": 2,
      "name": "Edson #2",
      "ip": "192.168.25.2",
      "port": 7878,
      "type": 2,
      "connected": false
    }
  ]
}```
---
### Connect
**Method:** `POST`  
**URL:** `https://localhost:7067/DeviceConnection/Connect?ip=192.168.27.247&type=1`
**Responses:**
#### 200 OK```json{
  "success": true,
  "message": null,
  "data": {
    "id": 62,
    "name": "LiteNet2 #62",
    "ip": "192.168.25.55",
    "port": 7878,
    "type": 1,
    "connected": true
  }
}```
#### 400 Bad Request```json{
  "success": false,
  "message": "Device is already connected",
  "data": null
}```
#### 400 Bad Request```json{
  "success": false,
  "message": "Device not found. Try discover.",
  "data": null
}```
---
### Disconnect
**Method:** `POST`  
**URL:** `https://localhost:7067/DeviceConnection/Disconnect?ip=192.168.27.247&type=1`
**Responses:**
#### 200 OK```json{
  "success": true,
  "message": null,
  "data": {
    "id": 62,
    "name": "LiteNet2 #62",
    "ip": "192.168.25.55",
    "port": 7878,
    "type": 1,
    "connected": false
  }
}```
#### 400 Bad Request```json{
  "success": false,
  "message": "Device not found. Try discover.",
  "data": null
}```
#### 400 Bad Request```json{
  "success": false,
  "message": "Device is not connected",
  "data": null
}```
---
## LiteNet1Commands
<h1 id="visão-geral">Visão Geral</h1>
<p>O <strong>LiteNet1Commands</strong> gerencia comandos específicos para dispositivos LiteNet1, oferecendo funcionalidades básicas de controle de acesso e configuração. Este controller permite obter informações do dispositivo, controlar liberações de entrada/saída, configurar parâmetros operacionais e gerenciar configurações de rede para dispositivos LiteNet1 conectados.</p>
<h2 id="pré-requisitos">Pré-requisitos</h2>
<p>⚠️ <strong>IMPORTANTE</strong>: Antes de utilizar qualquer comando desta controller, siga estes passos obrigatórios:</p>
<ol>
<li><p>Descobrir dispositivos usando <code>DeviceConnection/DiscoverDevices</code> ou <code>GetDevices</code>.</p>
</li>
<li><p>Conectar-se ao dispositivo LiteNet1 usando <code>DeviceConnection/Connect</code>.</p>
</li>
</ol>
<h2 id="estrutura-dos-endpoints">Estrutura dos Endpoints</h2>
<p>Todos os endpoints possuem o padrão:</p>
<ul>
<li><p><strong>Método</strong>: POST</p>
</li>
<li><p><strong>Parâmetro obrigatório</strong>: <code>device</code> (Objeto representando o LiteNet1 conectado)</p>
</li>
<li><p><strong>Retorno</strong>: DeviceResponse</p>
</li>
</ul>
<hr />
<h2 id="comandos-de-leitura-get">Comandos de Leitura (Get)</h2>
<h3 id="informações-do-dispositivo">Informações do Dispositivo</h3>
<ul>
<li><p><code>/GetFirmwareVersion</code>: Obtém a versão do firmware instalado no dispositivo.</p>
</li>
<li><p><code>/GetId</code>: Obtém o ID único do dispositivo.</p>
</li>
</ul>
<h3 id="configurações-de-rede">Configurações de Rede</h3>
<ul>
<li><code>/GetIpMode</code>: Obtém o modo de configuração IP atual (estático/dinâmico).</li>
</ul>
<h3 id="configurações-e-status">Configurações e Status</h3>
<ul>
<li><p><code>/GetCounters</code>: Obtém contadores de entrada e saída.</p>
</li>
<li><p><code>/GetShowCounters</code>: Obtém configuração de exibição dos contadores.</p>
</li>
<li><p><code>/GetAll</code>: Obtém todas as configurações gerais do dispositivo.</p>
</li>
</ul>
<hr />
<h2 id="comandos-de-escrita-set">Comandos de Escrita (Set)</h2>
<h3 id="controle-de-acesso">Controle de Acesso</h3>
<ul>
<li><p><code>/ReleaseEntry</code>: Libera entrada com mensagem personalizada.</p>
</li>
<li><p><code>/ReleaseExit</code>: Libera saída com mensagem personalizada.</p>
</li>
</ul>
<h3 id="configurações-de-identificação">Configurações de Identificação</h3>
<ul>
<li><code>/SetId</code>: Define novo ID do dispositivo.</li>
</ul>
<h3 id="configurações-de-rede-1">Configurações de Rede</h3>
<ul>
<li><code>/SetIp</code>: Define endereço IP do dispositivo.</li>
</ul>
<h3 id="configurações-de-operação">Configurações de Operação</h3>
<ul>
<li><p><code>/SetFlowControl</code>: Define modo de controle de fluxo (livre, controlado, bloqueado).</p>
</li>
<li><p><code>/SetEntryClockwise</code>: Define sentido de entrada (horário/anti-horário).</p>
</li>
<li><p><code>/SetShowCounters</code>: Ativa/desativa exibição de contadores.</p>
</li>
</ul>
<h3 id="configurações-de-som">Configurações de Som</h3>
<ul>
<li><code>/SetBuzzerMute</code>: Ativa/desativa buzzer.</li>
</ul>
<h3 id="configurações-completas">Configurações Completas</h3>
<ul>
<li><code>/SetAll</code>: Define todas as configurações do dispositivo simultaneamente.</li>
</ul>
<h3 id="comandos-de-sistema">Comandos de Sistema</h3>
<ul>
<li><p><code>/Reset</code>: Reinicia o dispositivo.</p>
</li>
<li><p><code>/ResetCounters</code>: Zera contadores de entrada e saída.</p>
</li>
</ul>
<hr />
<h2 id="exemplo-de-fluxo-de-uso">Exemplo de Fluxo de Uso</h2>
<pre class="click-to-expand-wrapper is-snippet-wrapper"><code>1. Descobrir dispositivos (DeviceConnection).
2. Conectar ao LiteNet1 (DeviceConnection).
3. Obter configurações gerais (GetAll).
4. Configurar controle de fluxo (SetFlowControl).
5. Definir ID do dispositivo (SetId).
6. Controlar acesso (ReleaseEntry, ReleaseExit).
7. Monitorar contadores (GetCounters).

</code></pre><hr />
<h2 id="parâmetros-importantes">Parâmetros Importantes</h2>
<h3 id="comando-setall">Comando SetAll</h3>
<ul>
<li><p><code>controleFluxo</code>: Modo de controle de fluxo (ModoFluxo)</p>
</li>
<li><p><code>modoIdentificacao</code>: Modo de identificação de entrada (ModoEntrada)</p>
</li>
<li><p><code>mudo</code>: Status do buzzer (true/false)</p>
</li>
<li><p><code>id</code>: ID do dispositivo</p>
</li>
<li><p><code>entradaSentidoHorario</code>: Sentido de entrada (true/false)</p>
</li>
<li><p><code>exibirRelogio</code>: Exibir relógio (true/false)</p>
</li>
<li><p><code>exibirContador</code>: Exibir contador (true/false)</p>
</li>
<li><p><code>duracaoAcionamento</code>: Duração do acionamento em segundos</p>
</li>
<li><p><code>mensagemPadrao</code>: Mensagem padrão do display</p>
</li>
<li><p><code>mensagemSecundaria</code>: Mensagem secundária do display</p>
</li>
</ul>
<h3 id="comando-setflowcontrol">Comando SetFlowControl</h3>
<ul>
<li><code>ModoFluxo</code>: Enum com opções de controle de fluxo</li>
</ul>
<h3 id="comandos-de-liberação">Comandos de Liberação</h3>
<ul>
<li><code>message</code>: Mensagem a ser exibida durante a liberação</li>
</ul>
<hr />
<h2 id="notas-importantes">Notas Importantes</h2>
<ul>
<li><p>Todos os comandos são executados de forma assíncrona.</p>
</li>
<li><p>O dispositivo deve estar conectado antes de usar comandos.</p>
</li>
<li><p>Alguns comandos podem exigir reinicialização do dispositivo.</p>
</li>
<li><p>Configurações são salvas permanentemente no dispositivo.</p>
</li>
<li><p>Comandos de reset podem causar desconexões temporárias.</p>
</li>
<li><p>A LiteNet1 oferece funcionalidades básicas comparado às versões mais recentes.</p>
</li>
<li><p>O controle de fluxo permite diferentes modos de operação da catraca.</p>
</li>
<li><p>Configurações de display e mensagens são limitadas comparado ao LiteNet3.</p>
</li>
</ul>

### Comandos de Leitura (Get)
#### Informações do Dispositivo
##### GetFirmwareVersion
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/GetFirmwareVersion`
**Headers:**
- **Content-Type**: `application/json`
---
##### GetId
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/GetId`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": {
    "id": 4,
    "dataHora": "2025-07-03T15:25:53.4457319-03:00",
    "ts": 0.016673,
    "comando": "gid",
    "cmd": "Z2lk",
    "retorno": "\\65533",
    "ret": "/w==",
    "liteNet": {
      "mensagemPadrao": null,
      "mensagemSecundaria": null,
      "mudo": false,
      "exibirRelogio": false,
      "exibirContador": false,
      "entradaSentidoHorario": false,
      "reservado": "00000",
      "controleFluxo": 0,
      "modoIdentificacao": 0,
      "tag": null,
      "mac": "Pp6TAAaB",
      "iniciada": true,
      "status": "OK",
      "id": 255,
      "ip": "192.168.27.211",
      "porta": 1001,
      "faixaIP": null,
      "versaoFirmware": "2.0",
      "mascaraSubRede": null,
      "duracaoAcionamento": 0,
      "modoIP": 0,
      "contadorHorario": 0,
      "contadorAntiHorario": 0
    },
    "identificacao": {},
    "tag": null,
    "protocolo": 0
  }
}```
---
#### Configurações de Rede
##### GetIpMode
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/GetIpMode`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": {
    "id": 5,
    "dataHora": "2025-07-03T15:26:09.6897888-03:00",
    "ts": 0.009147,
    "comando": "ipg",
    "cmd": "aXBn",
    "retorno": "\\0\\65533\\65533\\65533\\0",
    "ret": "AP///AA=",
    "liteNet": {
      "mensagemPadrao": null,
      "mensagemSecundaria": null,
      "mudo": false,
      "exibirRelogio": false,
      "exibirContador": false,
      "entradaSentidoHorario": false,
      "reservado": "00000",
      "controleFluxo": 0,
      "modoIdentificacao": 0,
      "tag": null,
      "mac": "Pp6TAAaB",
      "iniciada": true,
      "status": "OK",
      "id": 255,
      "ip": "192.168.27.211",
      "porta": 1001,
      "faixaIP": null,
      "versaoFirmware": "2.0",
      "mascaraSubRede": "255.255.252.0",
      "duracaoAcionamento": 0,
      "modoIP": 0,
      "contadorHorario": 0,
      "contadorAntiHorario": 0
    },
    "identificacao": {},
    "tag": null,
    "protocolo": 0
  }
}```
---
#### Configurações e Status
##### GetCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/GetCounters`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": [
    59903,
    89772
  ]
}```
---
##### GetShowCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/GetShowCounters`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": [
    59903,
    89772
  ]
}```
---
##### GetAll
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/GetAll`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": "mcs\\ControlaEntradaESaidaLiberada\\Nunhum\\False\\255\\True\\False\\False\\3\\00000\\                "
}```
---
### Comandos de Escrita (Set)
#### Controle de Acesso
##### ReleaseEntry
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/ReleaseEntry?message=Bem vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": {
    "id": 10,
    "dataHora": "0001-01-01T00:00:00",
    "ts": null,
    "comando": "lgu\\0Bem vindo!",
    "cmd": "bGd1AEJlbSB2aW5kbyE=",
    "retorno": null,
    "ret": null,
    "liteNet": {
      "mensagemPadrao": "                ",
      "mensagemSecundaria": "                ",
      "mudo": false,
      "exibirRelogio": false,
      "exibirContador": false,
      "entradaSentidoHorario": true,
      "reservado": "00000",
      "controleFluxo": 1,
      "modoIdentificacao": 0,
      "tag": null,
      "mac": "Pp6TAAaB",
      "iniciada": true,
      "status": "OK",
      "id": 255,
      "ip": "192.168.27.211",
      "porta": 1001,
      "faixaIP": null,
      "versaoFirmware": "2.0",
      "mascaraSubRede": "255.255.252.0",
      "duracaoAcionamento": 3,
      "modoIP": 0,
      "contadorHorario": 59903,
      "contadorAntiHorario": 89772
    },
    "identificacao": {},
    "tag": null,
    "protocolo": 0
  }
}```
---
##### ReleaseExit
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/ReleaseExit?message=Bem vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": {
    "id": 12,
    "dataHora": "0001-01-01T00:00:00",
    "ts": null,
    "comando": "lgu\\1Bem vindo!",
    "cmd": "bGd1AUJlbSB2aW5kbyE=",
    "retorno": null,
    "ret": null,
    "liteNet": {
      "mensagemPadrao": "                ",
      "mensagemSecundaria": "                ",
      "mudo": false,
      "exibirRelogio": false,
      "exibirContador": false,
      "entradaSentidoHorario": true,
      "reservado": "00000",
      "controleFluxo": 1,
      "modoIdentificacao": 0,
      "tag": null,
      "mac": "Pp6TAAaB",
      "iniciada": true,
      "status": "OK",
      "id": 255,
      "ip": "192.168.27.211",
      "porta": 1001,
      "faixaIP": null,
      "versaoFirmware": "2.0",
      "mascaraSubRede": "255.255.252.0",
      "duracaoAcionamento": 3,
      "modoIP": 0,
      "contadorHorario": 59903,
      "contadorAntiHorario": 89772
    },
    "identificacao": {},
    "tag": null,
    "protocolo": 0
  }
}```
---
#### Configurações de Identificação
##### SetId
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetId?id=10`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
#### Configurações de Rede
##### SetIp
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetIp?ip=192.168.27.211`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### Unknown Code ```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
#### Configurações de Operação
##### SetFlowControl
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetFlowControl?controlledFlow=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
##### SetEntryClockwise
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetEntryClockwise?entryClockwise=false`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
##### SetShowCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetShowCounters?showCounters=false`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
#### Configurações de Som
##### SetBuzzerMute
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetBuzzerMute?on=false`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
#### Configurações Completas
##### SetAll
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/SetAll?controleFluxo=1&modoIdentificacao=0&mudo=false&id=10&entradaSentidoHorario=true&exibirRelogio=false&exibirContador=false&duracaoAcionamento=5&mensagemPadrao=Bem vindo!&mensagemSecundaria=Bem vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": "mcsOK"
}```
---
#### Comandos de Sistema
##### Reset
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/Reset`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### Unknown Code ```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
##### ResetCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet1Commands/ResetCounters`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### Unknown Code ```json{
  "ip": "192.168.27.211",
  "id": 255,
  "command": 0,
  "type": 0,
  "response": null
}```
---
## LiteNet2Commands
<h2 id="visão-geral"><strong>Visão Geral</strong></h2>
<p>O <strong>LiteNet2Commands</strong> gerencia comandos específicos para dispositivos LiteNet2, permitindo configurar, controlar e obter informações detalhadas sobre dispositivos LiteNet2 conectados. Este controller oferece funcionalidades de controle de acesso, configuração de rede, gerenciamento de fluxo, personalização de interface e controle biométrico.</p>
<h2 id="pré-requisitos"><strong>Pré-requisitos</strong></h2>
<p>⚠️ <strong>IMPORTANTE</strong>: Antes de utilizar qualquer comando desta controller, siga estes passos obrigatórios:</p>
<ol>
<li><p>Descobrir dispositivos usando <code>DeviceConnection/DiscoverDevices</code> ou <code>GetDevices</code></p>
</li>
<li><p>Conectar-se ao dispositivo LiteNet2 usando <code>DeviceConnection/Connect</code></p>
</li>
</ol>
<h2 id="estrutura-dos-endpoints"><strong>Estrutura dos Endpoints</strong></h2>
<p>Todos os endpoints possuem o padrão:</p>
<ul>
<li><p><strong>Método</strong>: POST</p>
</li>
<li><p><strong>Parâmetro obrigatório</strong>: <code>device</code> (Objeto representando o LiteNet2 conectado)</p>
</li>
<li><p><strong>Retorno</strong>: DeviceResponse</p>
</li>
</ul>
<hr />
<h2 id="comandos-de-leitura-get"><strong>Comandos de Leitura (Get)</strong></h2>
<h3 id="informações-do-dispositivo"><strong>Informações do Dispositivo</strong></h3>
<ul>
<li><p><code>/GetFirmwareVersion</code>: Obtém a versão do firmware instalado</p>
</li>
<li><p><code>/GetSerialNumber</code>: Obtém o número de série do dispositivo</p>
</li>
<li><p><code>/GetId</code>: Obtém o ID atual do dispositivo</p>
</li>
</ul>
<h3 id="configurações-de-rede"><strong>Configurações de Rede</strong></h3>
<ul>
<li><p><code>/GetIpMode</code>: Obtém o modo de configuração IP (DHCP/Estático)</p>
</li>
<li><p><code>/GetMac</code>: Obtém o endereço MAC do dispositivo</p>
</li>
</ul>
<h3 id="configurações-de-controle-de-fluxo"><strong>Configurações de Controle de Fluxo</strong></h3>
<ul>
<li><p><code>/GetFlowControl</code>: Obtém configurações básicas de fluxo</p>
</li>
<li><p><code>/GetFlowControlExtended</code>: Obtém configurações avançadas de fluxo</p>
</li>
<li><p><code>/GetEntryClockwise</code>: Obtém direção de entrada (sentido horário/anti-horário)</p>
</li>
<li><p><code>/GetReleaseDuration</code>: Obtém tempo de liberação da catraca</p>
</li>
</ul>
<h3 id="configurações-de-interface"><strong>Configurações de Interface</strong></h3>
<ul>
<li><p><code>/GetMessageLine1</code>: Obtém mensagem da linha 1 do display</p>
</li>
<li><p><code>/GetMessageLine2</code>: Obtém mensagem da linha 2 do display</p>
</li>
<li><p><code>/GetShowCounters</code>: Obtém status de exibição de contadores</p>
</li>
<li><p><code>/GetMenuPassword</code>: Obtém senha do menu local</p>
</li>
</ul>
<h3 id="configurações-biométricas"><strong>Configurações Biométricas</strong></h3>
<ul>
<li><code>/GetFingerprintIdentificationMode</code>: Obtém modo de identificação por digital</li>
</ul>
<h3 id="configurações-de-som"><strong>Configurações de Som</strong></h3>
<ul>
<li><code>/GetBuzzerMute</code>: Obtém status de silenciamento do buzzer</li>
</ul>
<h3 id="contadores"><strong>Contadores</strong></h3>
<ul>
<li><code>/GetCounters</code>: Obtém contadores de entrada e saída</li>
</ul>
<hr />
<h2 id="comandos-de-escrita-set"><strong>Comandos de Escrita (Set)</strong></h2>
<h3 id="controle-de-acesso"><strong>Controle de Acesso</strong></h3>
<ul>
<li><p><code>/ReleaseEntry</code>: Libera entrada com mensagem personalizada</p>
</li>
<li><p><code>/ReleaseExit</code>: Libera saída com mensagem personalizada</p>
</li>
<li><p><code>/ReleaseEntryAndExit</code>: Libera entrada e saída simultaneamente</p>
</li>
</ul>
<h3 id="notificações-e-mensagens"><strong>Notificações e Mensagens</strong></h3>
<ul>
<li><p><code>/Notify</code>: Envia notificação visual e sonora (duração, tom, cor, exibição)</p>
</li>
<li><p><code>/TempMessage</code>: Exibe mensagem temporária no display</p>
</li>
<li><p><code>/SetMessageLine1</code>: Define mensagem permanente na linha 1</p>
</li>
<li><p><code>/SetMessageLine2</code>: Define mensagem permanente na linha 2</p>
</li>
</ul>
<h3 id="configurações-de-identificação"><strong>Configurações de Identificação</strong></h3>
<ul>
<li><code>/SetId</code>: Define novo ID do dispositivo</li>
</ul>
<h3 id="configurações-de-rede-1"><strong>Configurações de Rede</strong></h3>
<ul>
<li><p><code>/SetIp</code>: Define configuração de IP (DHCP/Estático, IP, máscara)</p>
</li>
<li><p><code>/SetMac</code>: Define novo endereço MAC</p>
</li>
</ul>
<h3 id="configurações-de-operação"><strong>Configurações de Operação</strong></h3>
<ul>
<li><p><code>/SetFlowControl</code>: Define controle de fluxo básico</p>
</li>
<li><p><code>/SetFlowControlExtended</code>: Define controle de fluxo avançado</p>
</li>
<li><p><code>/SetEntryClockwise</code>: Define direção de entrada</p>
</li>
<li><p><code>/SetReleaseDuration</code>: Define tempo de liberação da catraca</p>
</li>
</ul>
<h3 id="configurações-biométricas-1"><strong>Configurações Biométricas</strong></h3>
<ul>
<li><code>/SetFingerprintIdentificationMode</code>: Define modo de identificação por digital</li>
</ul>
<h3 id="configurações-de-interface-1"><strong>Configurações de Interface</strong></h3>
<ul>
<li><p><code>/SetMenuPassword</code>: Define senha do menu local</p>
</li>
<li><p><code>/SetShowCounters</code>: Ativa/desativa exibição de contadores</p>
</li>
</ul>
<h3 id="configurações-de-som-1"><strong>Configurações de Som</strong></h3>
<ul>
<li><code>/SetBuzzerMute</code>: Ativa/desativa buzzer</li>
</ul>
<h3 id="comandos-de-sistema"><strong>Comandos de Sistema</strong></h3>
<ul>
<li><p><code>/Reset</code>: Reinicia o dispositivo</p>
</li>
<li><p><code>/ResetCounters</code>: Zera contadores de entrada e saída</p>
</li>
<li><p><code>/ResetPeripherals</code>: Reinicia periféricos conectados</p>
</li>
</ul>
<hr />
<h2 id="exemplo-de-fluxo-de-uso"><strong>Exemplo de Fluxo de Uso</strong></h2>
<pre class="click-to-expand-wrapper is-snippet-wrapper"><code>1. Descobrir dispositivos (DeviceConnection)
2. Conectar ao LiteNet2 (DeviceConnection)
3. Obter configurações atuais (GetFlowControl, GetCounters)
4. Configurar fluxo (SetFlowControl/SetFlowControlExtended)
5. Personalizar display (SetMessageLine1, SetMessageLine2)
6. Controlar acesso (ReleaseEntry, Notify)
7. Monitorar contadores (GetCounters)

</code></pre><hr />
<h2 id="parâmetros-importantes"><strong>Parâmetros Importantes</strong></h2>
<h3 id="comando-notify"><strong>Comando Notify</strong></h3>
<ul>
<li><p><code>duration</code>: Duração da notificação (em ms)</p>
</li>
<li><p><code>tone</code>: Tom sonoro (0-N)</p>
</li>
<li><p><code>color</code>: Cor da notificação (0-N)</p>
</li>
<li><p><code>showMessage</code>: Exibir mensagem (0/1)</p>
</li>
</ul>
<h3 id="comando-setip"><strong>Comando SetIp</strong></h3>
<ul>
<li><p><code>dhcp</code>: Usar DHCP (true/false)</p>
</li>
<li><p><code>ip</code>: Endereço IP estático</p>
</li>
<li><p><code>subnetMask</code>: Máscara de sub-rede</p>
</li>
</ul>
<h3 id="comando-setflowcontrolsetflowcontrolextended"><strong>Comando SetFlowControl/SetFlowControlExtended</strong></h3>
<ul>
<li><p><code>controlledFlow</code>: Enum definindo tipo de fluxo</p>
</li>
<li><p><code>flowControlExtended</code>: Configurações avançadas de fluxo</p>
</li>
</ul>
<h3 id="comando-setfingerprintidentificationmode"><strong>Comando SetFingerprintIdentificationMode</strong></h3>
<ul>
<li><code>mode</code>: Modo de identificação biométrica</li>
</ul>
<hr />
<h2 id="notas-importantes"><strong>Notas Importantes</strong></h2>
<ul>
<li><p>Todos os comandos são executados de forma assíncrona</p>
</li>
<li><p>O dispositivo deve estar conectado antes de usar comandos</p>
</li>
<li><p>Alguns comandos podem exigir reinicialização do dispositivo</p>
</li>
<li><p>Configurações são salvas permanentemente no dispositivo</p>
</li>
<li><p>Comandos de reset podem causar desconexões temporárias</p>
</li>
<li><p>Controle granular de mensagens com duas linhas de display</p>
</li>
<li><p>Funcionalidades de reset específicas para periféricos</p>
</li>
</ul>

### Comandos de Leitura (Get)
#### Informações do Dispositivo
##### GetFirmwareVersion
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetFirmwareVersion`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 268,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "2.2.2 R0"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 268,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetId
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetId`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 259,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 62
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 259,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetSerialNumber
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetSerialNumber`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 269,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "6718"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 269,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ---
#### Configurações de Rede
##### GetIpMode
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetIpMode`
**Headers:**
- **Content-Type**: `application/json`
---
##### GetMac
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetMac`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 261,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "33 65 20 39 65 20"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 261,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
#### Configurações de Controle de Fluxo
##### GetEntryClockwise
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetEntryClockwise`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetFlowControl
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetFlowControl`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 258,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": null
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 258,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetFlowControlExtended
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetFlowControlExtended`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 271,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 0
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 271,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetReleaseDuration
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetReleaseDuration`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 266,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 6
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 266,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ---
#### Configurações de Interface
##### GetMenuPassword
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetMenuPassword`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 267,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "1111"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 267,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetMessageLine1
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetMessageLine1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 262,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "Toletus"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 262,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetMessageLine2
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetMessageLine2`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 263,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "Bem-Vindo!"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 263,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
##### GetShowCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetShowCounters`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 264,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": false
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 264,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
#### Configurações Biométricas
##### GetFingerprintIdentificationMode
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetFingerprintIdentificationMode`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 270,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 0
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 270,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 257,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
---
#### Configurações de Som
##### GetBuzzerMute
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetBuzzerMute`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 265,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": false
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 265,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 265,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Contadores
##### GetCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/GetCounters`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 272,
  "type": 1,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 65475
    }
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 265,
  "type": 1,
  "response": {
    "success": false,
    "message": "The request has timed out",
    "data": null
  }
}```
#### Unknown Code ```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 265,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
### Comandos de Escrita (Set)
#### Controle de Acesso
##### ReleaseEntry
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/ReleaseEntry?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 1,
  "type": 1,
  "response": {
    "success": true,
    "message": "Entry released successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 1,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### ReleaseEntryAndExit
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/ReleaseEntryAndExit?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 6,
  "type": 1,
  "response": {
    "success": true,
    "message": "Entry and exit released successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 6,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### ReleaseExit
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/ReleaseExit?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 2,
  "type": 1,
  "response": {
    "success": true,
    "message": "Exit released successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 2,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Notificações e Mensagens
##### Notify
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/Notify?duration=1000&tone=0&color=0&showMessage=0`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 5,
  "type": 1,
  "response": {
    "success": true,
    "message": "Notification sent successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 5,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetMessageLine1
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetMessageLine1?message=Toletus`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 518,
  "type": 1,
  "response": {
    "success": true,
    "message": "Message line 1 set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 518,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetMessageLine2
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetMessageLine2?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 519,
  "type": 1,
  "response": {
    "success": true,
    "message": "Message line 2 set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 519,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### TempMessage
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/TempMessage?message=Mensagens temporárias`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 4,
  "type": 1,
  "response": {
    "success": true,
    "message": "Temporary message sent successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 4,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Configurações de Identificação
##### SetId
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetId`
**Headers:**
- **Content-Type**: `application/json`
---
#### Configurações de Rede
##### SetIp
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetIp?dhcp=false&ip=192.168.25.55&subnetMask=255.255.255.000`
**Headers:**
- **Content-Type**: `application/json`
---
##### SetMac
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetMac?mac=3e 9e 94 00 1a 3e`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 517,
  "type": 1,
  "response": {
    "success": true,
    "message": "MAC address set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 517,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Configurações de Operação
##### SetEntryClockwise
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetEntryClockwise?entryClockwise=true`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 513,
  "type": 1,
  "response": {
    "success": true,
    "message": "Entry clockwise set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 513,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetFlowControl
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetFlowControl?controlledFlow=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 514,
  "type": 1,
  "response": {
    "success": true,
    "message": "Flow control set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 514,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetFlowControlExtended
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetFlowControlExtended?flowControlExtended=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 527,
  "type": 1,
  "response": {
    "success": true,
    "message": "Extended flow control set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 527,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetReleaseDuration
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetReleaseDuration?releaseDuration=5000`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 522,
  "type": 1,
  "response": {
    "success": true,
    "message": "Release duration set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 522,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Configurações Biométricas
##### SetFingerprintIdentificationMode
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetFingerprintIdentificationMode?mode=0`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 526,
  "type": 1,
  "response": {
    "success": true,
    "message": "Fingerprint identification mode set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 526,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Configurações de Interface
##### SetMenuPassword
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetMenuPassword?password=1111`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 523,
  "type": 1,
  "response": {
    "success": true,
    "message": "Menu password set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 523,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetShowCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetShowCounters?showCounters=false`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 520,
  "type": 1,
  "response": {
    "success": true,
    "message": "Show counters set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 520,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Configurações de Som
##### SetBuzzerMute
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/SetBuzzerMute?on=false`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 521,
  "type": 1,
  "response": {
    "success": true,
    "message": "Buzzer mute set successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 521,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Comandos de Sistema
##### Reset
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/Reset`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 3,
  "type": 1,
  "response": {
    "success": true,
    "message": "Device reset successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 3,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### ResetCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/ResetCounters`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 528,
  "type": 1,
  "response": {
    "success": true,
    "message": "Counters reset successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 528,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### ResetPeripherals
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet2Commands/ResetPeripherals`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 7,
  "type": 1,
  "response": {
    "success": true,
    "message": "Peripherals reset successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 7,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
## LiteNet3Commands
<h2 id="visão-geral"><strong>Visão Geral</strong></h2>
<p>O <strong>LiteNet3Commands</strong> gerencia comandos específicos para dispositivos LiteNet3, permitindo configurar, controlar e obter informações detalhadas sobre dispositivos LiteNet3 conectados. Este controller oferece funcionalidades avançadas de controle de acesso, configuração de rede, gerenciamento de fluxo e personalização de interface.</p>
<h2 id="pré-requisitos"><strong>Pré-requisitos</strong></h2>
<p>⚠️ <strong>IMPORTANTE</strong>: Antes de utilizar qualquer comando desta controller, siga estes passos obrigatórios:</p>
<ol>
<li><p><strong>Descobrir dispositivos</strong> usando <code>DeviceConnection/DiscoverDevices</code> ou <code>GetDevices</code>.</p>
</li>
<li><p><strong>Conectar-se ao dispositivo</strong> LiteNet3 usando <code>DeviceConnection/Connect</code>.</p>
</li>
</ol>
<h2 id="estrutura-dos-endpoints"><strong>Estrutura dos Endpoints</strong></h2>
<p>Todos os endpoints possuem o padrão:</p>
<ul>
<li><p><strong>Método</strong>: POST</p>
</li>
<li><p><strong>Parâmetro obrigatório</strong>: <code>device</code> (Objeto representando o LiteNet3 conectado)</p>
</li>
<li><p><strong>Retorno</strong>: <code>DeviceResponse</code></p>
</li>
</ul>
<hr />
<h2 id="comandos-de-leitura-get"><strong>Comandos de Leitura (Get)</strong></h2>
<h3 id="informações-do-dispositivo"><strong>Informações do Dispositivo</strong></h3>
<ul>
<li><p><code>/GetFirmwareVersion</code>: Obtém a versão do firmware instalado.</p>
</li>
<li><p><code>/GetFactory</code>: Obtém informações de fábrica do dispositivo.</p>
</li>
</ul>
<h3 id="configurações-de-rede"><strong>Configurações de Rede</strong></h3>
<ul>
<li><code>/GetEthernet</code>: Obtém configurações de rede ethernet (IP, máscara, gateway).</li>
</ul>
<h3 id="configurações-de-controle-de-fluxo"><strong>Configurações de Controle de Fluxo</strong></h3>
<ul>
<li><p><code>/GetFlow</code>: Obtém configurações de fluxo (direção, pictogramas, tempos de espera).</p>
</li>
<li><p><code>/GetSensor</code>: Obtém configurações e status dos sensores.</p>
</li>
</ul>
<h3 id="configurações-de-interface"><strong>Configurações de Interface</strong></h3>
<ul>
<li><code>/GetDisplay</code>: Obtém configurações do display (mensagens, modo de exibição).</li>
</ul>
<h3 id="configurações-de-som"><strong>Configurações de Som</strong></h3>
<ul>
<li><code>/GetBuzzerMute</code>: Obtém status de silenciamento do buzzer.</li>
</ul>
<h3 id="status-e-configurações-gerais"><strong>Status e Configurações Gerais</strong></h3>
<ul>
<li><code>/GetStatusAndConfigurations</code>: Obtém status completo e todas as configurações do dispositivo.</li>
</ul>
<hr />
<h2 id="comandos-de-escrita-set"><strong>Comandos de Escrita (Set)</strong></h2>
<h3 id="controle-de-acesso"><strong>Controle de Acesso</strong></h3>
<ul>
<li><p><code>/ReleaseEntry</code>: Libera entrada com mensagem personalizada.</p>
</li>
<li><p><code>/ReleaseExit</code>: Libera saída com mensagem personalizada.</p>
</li>
<li><p><code>/ReleaseEntryAndExit</code>: Libera entrada e saída simultaneamente.</p>
</li>
</ul>
<h3 id="notificações-e-mensagens"><strong>Notificações e Mensagens</strong></h3>
<ul>
<li><p><code>/Notify</code>: Envia notificação visual e sonora com mensagens personalizadas.</p>
</li>
<li><p><code>/SetDisplay</code>: Define mensagens permanentes no display.</p>
</li>
</ul>
<h3 id="configurações-de-identificação"><strong>Configurações de Identificação</strong></h3>
<ul>
<li><p><code>/SetId</code>: Define novo ID do dispositivo.</p>
</li>
<li><p><code>/SetAlias</code>: Define alias/apelido do dispositivo.</p>
</li>
</ul>
<h3 id="configurações-de-rede-1"><strong>Configurações de Rede</strong></h3>
<ul>
<li><p><code>/SetIpConfigurartion</code>: Define configuração completa de IP (IP, máscara, gateway).</p>
</li>
<li><p><code>/SetStaticIp</code>: Habilita/desabilita IP estático.</p>
</li>
<li><p><code>/SetMac</code>: Define novo endereço MAC.</p>
</li>
</ul>
<h3 id="configurações-de-operação"><strong>Configurações de Operação</strong></h3>
<ul>
<li><p><code>/SetFlow</code>: Define configurações completas de fluxo (direção, pictogramas, tempos).</p>
</li>
<li><p><code>/SetReleaseDuration</code>: Define tempo de liberação da catraca.</p>
</li>
</ul>
<h3 id="configurações-de-interface-1"><strong>Configurações de Interface</strong></h3>
<ul>
<li><code>/SetMenuPassword</code>: Define senha do menu local.</li>
</ul>
<h3 id="configurações-de-som-1"><strong>Configurações de Som</strong></h3>
<ul>
<li><p><code>/SetBuzzerMute</code>: Ativa/desativa buzzer.</p>
</li>
<li><p><code>/BuzzerPlay</code>: Reproduz som no buzzer.</p>
</li>
<li><p><code>/BuzzerStop</code>: Para reprodução do buzzer.</p>
</li>
<li><p><code>/BuzzerMute</code>: Silencia/dessilencia buzzer temporariamente.</p>
</li>
</ul>
<h3 id="comandos-de-sistema"><strong>Comandos de Sistema</strong></h3>
<ul>
<li><p><code>/Reset</code>: Reinicia o dispositivo.</p>
</li>
<li><p><code>/ResetCounters</code>: Zera contadores de entrada e saída.</p>
</li>
</ul>
<hr />
<h2 id="exemplo-de-fluxo-de-uso"><strong>Exemplo de Fluxo de Uso</strong></h2>
<pre class="click-to-expand-wrapper is-snippet-wrapper"><code>1. Descobrir dispositivos (DeviceConnection).
2. Conectar ao LiteNet3 (DeviceConnection).
3. Obter status geral (GetStatusAndConfigurations).
4. Configurar fluxo (SetFlow).
5. Personalizar display (SetDisplay).
6. Controlar acesso (ReleaseEntry, Notify).
7. Monitorar sensores (GetSensor).

</code></pre><hr />
<h2 id="parâmetros-importantes"><strong>Parâmetros Importantes</strong></h2>
<h3 id="comando-notify"><strong>Comando Notify</strong></h3>
<ul>
<li><p><code>cmd</code>: Comando de notificação</p>
</li>
<li><p><code>time</code>: Tempo de exibição (em segundos)</p>
</li>
<li><p><code>alignBot</code>: Alinhamento da linha inferior</p>
</li>
<li><p><code>topRow</code>: Texto da linha superior</p>
</li>
<li><p><code>bottomRow</code>: Texto da linha inferior</p>
</li>
</ul>
<h3 id="comando-setflow"><strong>Comando SetFlow</strong></h3>
<ul>
<li><p><code>inverted</code>: Inversão do fluxo</p>
</li>
<li><p><code>in</code>: Configuração de entrada</p>
</li>
<li><p><code>out</code>: Configuração de saída</p>
</li>
<li><p><code>frontWait</code>: Tempo de espera frontal</p>
</li>
<li><p><code>pictoWaitIn</code>: Tempo de espera do pictograma de entrada</p>
</li>
<li><p><code>pictoWaitOut</code>: Tempo de espera do pictograma de saída</p>
</li>
</ul>
<h3 id="comando-resetcounters"><strong>Comando ResetCounters</strong></h3>
<ul>
<li><p><code>resetIn</code>: Resetar contador de entrada</p>
</li>
<li><p><code>resetOut</code>: Resetar contador de saída</p>
</li>
</ul>
<hr />
<h2 id="notas-importantes"><strong>Notas Importantes</strong></h2>
<ul>
<li><p>Todos os comandos são executados de forma <strong>assíncrona</strong>.</p>
</li>
<li><p>O dispositivo deve estar <strong>conectado</strong> antes de usar comandos.</p>
</li>
<li><p>Alguns comandos podem exigir <strong>reinicialização</strong> do dispositivo.</p>
</li>
<li><p>Configurações são <strong>salvas permanentemente</strong> no dispositivo.</p>
</li>
<li><p>Comandos de reset podem causar <strong>desconexões temporárias</strong>.</p>
</li>
<li><p>O LiteNet3 oferece <strong>configurações mais avançadas</strong> comparado às versões anteriores.</p>
</li>
<li><p>Suporte a <strong>configurações de rede completas</strong> (IP, máscara, gateway).</p>
</li>
<li><p><strong>Controle granular</strong> de buzzer com múltiplas funções.</p>
</li>
</ul>

### Comandos de Leitura (Get)
#### Informações do Dispositivo
##### GetFirmwareVersion
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetFirmwareVersion`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 10,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "mute": false
    }
  }
}```
---
##### GetFactory
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetFactory`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 16,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "serial": "00000002",
      "factory": false,
      "firmware": "V1.0.1.2",
      "hardware": "V1.0.0"
    }
  }
}```
---
#### Configurações de Rede
##### GetEthernet
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetEthernet`
**Headers:**
- **Content-Type**: `application/json`
---
#### Configurações de Controle de Fluxo
##### GetFlow
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetFlow`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 11,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "inverted": false,
      "in": "controls",
      "out": "free",
      "frontWait": "0000FF",
      "pictoWaitIn": 1,
      "pictoWaitOut": 0
    }
  }
}```
---
##### GetSensor
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetSensor`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 13,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "in": 103,
      "out": 29,
      "left": 95,
      "right": 204
    }
  }
}```
---
#### Configurações de Interface
##### GetDisplay
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetDisplay`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 7,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "result": null,
      "topRow": "     Toletus    ",
      "bottomRow": "    Bem Vindo!  ",
      "mode": "message"
    }
  }
}```
---
#### Configurações de Som
##### GetBuzzerMute
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetBuzzerMute`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 10,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "mute": false
    }
  }
}```
---
#### Status e Configurações Gerais
##### GetStatusAndConfigurations
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/GetStatusAndConfigurations`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "serial": null,
      "releaseTime": 10000,
      "alias": "Edson",
      "id": 2,
      "menuPass": "1111",
      "supported": null,
      "installed": null,
      "devicesError": null,
      "generalErros": null
    }
  }
}```
---
### Comandos de Escrita (Set)
#### Controle de Acesso
##### ReleaseEntry
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/ReleaseEntry?topRow=     Toletus    &bottomRow=    Bem Vindo!  `
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### ReleaseExit
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/ReleaseExit?topRow=     Toletus    &bottomRow=    Bem Vindo!  `
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### ReleaseEntryAndExit
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/ReleaseEntryAndExit?topRow=     Toletus    &bottomRow=    Bem Vindo!  `
**Headers:**
- **Content-Type**: `application/json`
---
#### Notificações e Mensagens
##### Notify
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/Notify?cmd=clear&time=10000&alignBot=left&topRow=Toletus&bottomRow=Bem%20vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 7,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### SetDisplay
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetDisplay?topRow=    Toletus     &bottomRow=   Bem vindo!   &mode=message`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 7,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
#### Configurações de Identificação
##### SetId
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetId?id=5`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 5,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### SetAlias
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetAlias?alias=LiteNet 3`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
#### Configurações de Rede
##### SetIpConfigurartion
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetIpConfigurartion?ip=192.168.25.2&mask=255.255.255.0&gateway=192.168.25.1`
**Headers:**
- **Content-Type**: `application/json`
---
##### SetStaticIp
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetStaticIp?staticIp=false`
**Headers:**
- **Content-Type**: `application/json`
---
##### SetMac
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetMac?macAddress=54:133:24:94:157:6`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 9,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
#### Configurações de Operação
##### SetFlow
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetFlow?inverted=false&in=controls&out=controls&frontWait=0000FF&pictoWaitIn=0&pictoWaitOut=0`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 11,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### SetReleaseDuration
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetReleaseDuration?releaseDuration=5000`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
#### Configurações de Interface
##### SetMenuPassword
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetMenuPassword?password=1111`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 12,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
#### Configurações de Som
##### SetBuzzerMute
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/SetBuzzerMute?mute=false`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 10,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### BuzzerPlay
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/BuzzerPlay?play=err:d=4,o=4,b=180:f%23,32p,f%23`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 2,
  "command": 10,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.25.2",
  "id": 5,
  "command": 10,
  "type": 2,
  "response": {
    "success": false,
    "message": "unauthorized",
    "data": null
  }
}```
---
##### BuzzerStop
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/BuzzerStop`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 5,
  "command": 10,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
##### BuzzerMute
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/BuzzerMute?mute=true`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 5,
  "command": 10,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
#### Comandos de Sistema
##### Reset
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/Reset`
**Headers:**
- **Content-Type**: `application/json`
---
##### ResetCounters
**Method:** `POST`  
**URL:** `https://localhost:7067/LiteNet3Commands/ResetCounters?resetIn=true&resetOut=true`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.2",
  "id": 5,
  "command": 13,
  "type": 2,
  "response": {
    "success": true,
    "message": null,
    "data": null
  }
}```
---
## SM25ReaderCommands
<p>O <strong>SM25ReaderCommands</strong> gerencia comandos específicos para leitor biométrico SM25, que faz parte do sistema LiteNet2. Esta controller permite configurar, controlar e gerenciar digitais biométricas em dispositivos SM25 conectados. O controller oferece funcionalidades completas para cadastro, leitura, configuração e manutenção de templates biométricos.</p>
<h2 id="pré-requisitos">Pré-requisitos</h2>
<p>⚠️ <strong>IMPORTANTE</strong>: Antes de utilizar qualquer comando desta controller, siga estes passos obrigatórios:</p>
<ol>
<li><p><strong>Descobrir dispositivos</strong> usando <code>DeviceConnection/DiscoverDevices</code> ou <code>GetDevices</code></p>
</li>
<li><p><strong>Conectar-se ao dispositivo LiteNet2</strong> usando <code>DeviceConnection/Connect</code></p>
</li>
</ol>
<h2 id="estrutura-dos-endpoints">Estrutura dos Endpoints</h2>
<p>Todos os endpoints possuem o padrão:</p>
<ul>
<li><p><strong>Método</strong>: POST</p>
</li>
<li><p><strong>Parâmetro obrigatório</strong>: <code>device</code> (Objeto representando o dispositivo LiteNet2 conectado)</p>
</li>
<li><p><strong>Retorno</strong>: <code>DeviceResponse</code></p>
</li>
</ul>
<hr />
<h2 id="comandos-de-leitura-get">Comandos de Leitura (Get)</h2>
<h3 id="informações-do-dispositivo">Informações do Dispositivo</h3>
<ul>
<li><p><code>/GetDeviceName</code>: Obtém o nome do dispositivo SM25</p>
</li>
<li><p><code>/GetFWVersion</code>: Obtém a versão do firmware do leitor</p>
</li>
<li><p><code>/GetDeviceId</code>: Obtém o ID do dispositivo SM25</p>
</li>
</ul>
<h3 id="gerenciamento-de-templates">Gerenciamento de Templates</h3>
<ul>
<li><p><code>/GetEmptyID</code>: Obtém o próximo ID disponível para cadastro</p>
</li>
<li><p><code>/GetEnrollCount</code>: Obtém a quantidade de digitais cadastradas</p>
</li>
<li><p><code>/GetEnrollData</code>: Obtém último template cadastrado</p>
</li>
<li><p><code>/GetTemplateStatus</code>: Verifica o status de um template específico (requer parâmetro <code>id</code>)</p>
</li>
<li><p><code>/ReadTemplate</code>: Lê um template específico (requer parâmetro <code>id</code>). Ao finalizar execute o comando <code>FPCancel</code>.</p>
</li>
</ul>
<h3 id="configurações-de-segurança">Configurações de Segurança</h3>
<ul>
<li><p><code>/GetDuplicationCheck</code>: Obtém status da verificação de duplicação</p>
</li>
<li><p><code>/GetSecurityLevel</code>: Obtém o nível de segurança configurado</p>
</li>
<li><p><code>/GetFingerTimeOut</code>: Obtém o tempo limite para leitura de digital</p>
</li>
</ul>
<hr />
<h2 id="comandos-de-escrita-set">Comandos de Escrita (Set)</h2>
<h3 id="cadastro-de-digitais">Cadastro de Digitais</h3>
<ul>
<li><p><code>/Enroll</code>: Inicia processo de cadastro de digital (requer parâmetro <code>id</code>). Ao finalizar, execute o comando <code>FPCancel</code>.</p>
</li>
<li><p><code>/EnrollAndStoreinRAM</code>: Cadastra digital temporariamente na RAM. Ao finalizar, execute o comando <code>FPCancel</code>.</p>
</li>
<li><p><code>/WriteTemplate</code>: Envie este comando antes de executar o <code>WriteTemplateData.</code></p>
</li>
<li><p><code>/WriteTemplateData</code>: Escreve dados específicos do template (requer <code>WriteTemplateDataRequest</code>)</p>
</li>
</ul>
<h3 id="configurações-do-dispositivo">Configurações do Dispositivo</h3>
<ul>
<li><p><code>/SetDeviceId</code>: Define novo ID do dispositivo (requer parâmetro <code>id</code>)</p>
</li>
<li><p><code>/SetDuplicationCheck</code>: Ativa/desativa verificação de duplicação (requer parâmetro <code>check</code>)</p>
</li>
<li><p><code>/SetSecurityLevel</code>: Define nível de segurança (requer parâmetro <code>level</code>)</p>
</li>
<li><p><code>/SetFingerTimeOut</code>: Define o tempo de espera para leitura de digital.</p>
</li>
</ul>
<h3 id="controle-de-processo">Controle de Processo</h3>
<ul>
<li><code>/FPCancel</code>: Cancela processo de leitura/cadastro em andamento</li>
</ul>
<h3 id="manutenção">Manutenção</h3>
<ul>
<li><p><code>/ClearAllTemplate</code>: Remove todos os templates cadastrados</p>
</li>
<li><p><code>/ClearTemplate</code>: Remove o template (digital) de um ID específico.</p>
</li>
</ul>
<hr />
<h2 id="exemplo-de-fluxo-de-uso">Exemplo de Fluxo de Uso</h2>
<pre class="click-to-expand-wrapper is-snippet-wrapper"><code>1. Descobrir dispositivos (DeviceConnection)
2. Conectar ao dispositivo LiteNet2 (DeviceConnection)
3. Verificar status do SM25 (GetDeviceName, GetFWVersion)
4. Obter próximo ID disponível (GetEmptyID)
5. Cadastrar nova digital (Enroll)
6. Verificar cadastro (GetEnrollCount, GetTemplateStatus)
7. Configurar segurança (SetSecurityLevel, SetDuplicationCheck)

</code></pre><hr />
<h2 id="parâmetros-importantes">Parâmetros Importantes</h2>
<h3 id="comando-gettemplatestatus--readtemplate">Comando GetTemplateStatus / ReadTemplate</h3>
<ul>
<li><strong>id</strong>: ID do template a ser verificado/lido</li>
</ul>
<h3 id="comando-enroll--setdeviceid">Comando Enroll / SetDeviceId</h3>
<ul>
<li><strong>id</strong>: ID para cadastro da digital ou novo ID do dispositivo</li>
</ul>
<h3 id="comando-setduplicationcheck">Comando SetDuplicationCheck</h3>
<ul>
<li><strong>check</strong>: <code>true</code> para ativar verificação de duplicação, <code>false</code> para desativar</li>
</ul>
<h3 id="comando-setsecuritylevel">Comando SetSecurityLevel</h3>
<ul>
<li><strong>level</strong>: Nível de segurança (valor numérico)</li>
</ul>
<h3 id="comando-writetemplatedata">Comando WriteTemplateData</h3>
<ul>
<li><p><strong>WriteTemplateDataRequest</strong>: Objeto contendo:</p>
<ul>
<li><p><code>Device</code>: Dispositivo de destino</p>
</li>
<li><p><code>Id</code>: ID do template</p>
</li>
<li><p><code>Template</code>: Array de bytes do template</p>
</li>
</ul>
</li>
</ul>
<hr />
<h2 id="notas-importantes">Notas Importantes</h2>
<ul>
<li><p><strong>Conexão</strong>: O SM25 é conectado através do dispositivo LiteNet2 principal</p>
</li>
<li><p><strong>Execução</strong>: Todos os comandos são executados de forma assíncrona</p>
</li>
<li><p><strong>Timeout</strong>: Comandos de leitura biométrica possuem timeout configurável</p>
</li>
<li><p><strong>Capacidade</strong>: Verificar limite de templates suportados pelo dispositivo</p>
</li>
<li><p><strong>Segurança</strong>: Níveis de segurança afetam precisão e velocidade de reconhecimento</p>
</li>
<li><p><strong>Duplicação</strong>: Verificação de duplicação previne cadastro de digitais repetidas</p>
</li>
<li><p><strong>RAM</strong>: Templates temporários em RAM são perdidos ao reiniciar o dispositivo</p>
</li>
<li><p><strong>Templates</strong>: Cada template ocupa espaço específico na memória do dispositivo</p>
</li>
</ul>

### Comandos de Leitura (Get)
#### Informações do Dispositivo
##### GetDeviceName
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetDeviceName`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 289,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "SM25B-3K"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 289,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetFWVersion
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetFWVersion`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 274,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "v1.2"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 274,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetDeviceId
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetDeviceId`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 273,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 1
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 273,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Gerenciamento de Templates
##### GetEmptyID
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetEmptyID`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 263,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 5
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 263,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetEnrollCount
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetEnrollCount`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 296,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 4
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 296,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetEnrollData
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetEnrollData`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
    "ip": "192.168.27.196",
    "id": 49,
    "command": 281,
    "type": 3,
    "response": {
        "success": true,
        "message": null,
        "data": {
            "content": "qlULAQQAAAAAAAAAAAAAAAAAAAAAAA8B" //Este endpoint retorna o último template válido armazenado na memória do dispositivo.
                                                          //Este é apenas um exemplo ilustrativo, não representa um retorno real da API.
        }
    }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 281,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetTemplateStatus
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetTemplateStatus?id=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 264,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "The appointed Template have been emptied"
    }
  }
}```
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 264,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "The appointed Template are not empty"
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 264,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### ReadTemplate
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/ReadTemplate?id=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
    "ip": "192.168.27.196",
    "id": 49,
    "command": 266,
    "type": 3,
    "response": {
        "success": true,
        "message": null,
        "data": {
            "content": "qlULAQQAAAAAAAAAAAAAAAAAAAAAAA8B" //Retorna os dados do template em seu formato bruto, sem tratamento ou conversão.
                                                          //Este é apenas um exemplo ilustrativo, não representa um retorno real da API.
        }
    }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 266,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 266,
  "type": 3,
  "response": {
    "success": false,
    "message": "Fail for instruction execute",
    "data": null
  }
}```
---
#### Configurações de Segurança
##### GetDuplicationCheck
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetDuplicationCheck`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 278,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 278,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetSecurityLevel
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetSecurityLevel`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 269,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 3
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 269,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### GetFingerTimeOut
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/GetFingerTimeOut`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 271,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 60
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 271,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
### Comandos de Escrita (Set)
#### Cadastro de Digitais
##### Enroll
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/Enroll?id=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 259,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "Waiting input fingerprint for first time."
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 259,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### EnrollAndStoreinRAM
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/EnrollAndStoreinRAM`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 280,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": "Waiting input fingerprint for first time."
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 280,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### WriteTemplate
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/WriteTemplate`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 267,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 267,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### WriteTemplateData
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/WriteTemplateData`
**Headers:**
- **Content-Type**: `application/json`
**Body:**
```json{
    "device": ,
    "id": 1,
    "template": "qlULAQQAAAAAAAAAAAAAAAAAAAAAAA8B" //Exemplo de template obtido via "SM25ReaderCommands/GetEnrollData"
                                                   //Atenção: este exemplo é meramente ilustrativo e não corresponde a um template válido.
}```
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 267,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 267,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 267,
  "type": 3,
  "response": {
    "success": false,
    "message": "Fail for instruction execute",
    "data": null
  }
}```
---
#### Configurações do Dispositivo
##### SetDeviceId
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/SetDeviceId?id=1`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 272,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 1
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 272,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetDuplicationCheck
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/SetDuplicationCheck?check=true`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 277,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 277,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetSecurityLevel
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/SetSecurityLevel?level=3`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 268,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 3
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 268,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
##### SetFingerTimeOut
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/SetFingerTimeOut?timeOut=60`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 270,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": 60
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 270,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Controle de Processo
##### FPCancel
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/FPCancel`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 304,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 304,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
#### Manutenção
##### ClearTemplate
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/ClearTemplate?id=1`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 261,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 261,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 261,
  "type": 3,
  "response": {
    "success": false,
    "message": "Fail for instruction execute",
    "data": null
  }
}```
---
##### ClearAllTemplate
**Method:** `POST`  
**URL:** `https://localhost:7067/SM25ReaderCommands/ClearAllTemplate`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 262,
  "type": 3,
  "response": {
    "success": true,
    "message": null,
    "data": {
      "content": true
    }
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 262,
  "type": 3,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
## Webhook
<p>O <strong>Webhook</strong> permite configurar o endpoint que receberá notificações enviadas automaticamente pelo <strong>Toletus Hub</strong>.</p>
<p>Essa configuração é utilizada para integrar o Hub com sistemas externos que precisam ser notificados sobre eventos em tempo real.</p>

### SetEndpoint
**Method:** `POST`  
**URL:** `https://localhost:7067/Webhook/SetEndpoint?endpoint=https://api.meusistema.com/webhook`
---
## BasicCommonCommands
<p>O <strong>BasicCommonCommands</strong> reúne <strong>comandos comuns às catracas LiteNet (LiteNet1, LiteNet2 e LiteNet3)</strong>, permitindo a liberação de <strong>entrada</strong>, <strong>saída</strong> ou <strong>ambas</strong> diretamente via API do Toletus Hub.</p>
<p>Use estes endpoints quando precisar acionar catracas remotamente de forma simples e padronizada entre os modelos LiteNet.</p>
<h2 id="pré-requisitos"><strong>Pré-requisitos</strong></h2>
<p>⚠️ Antes de utilizar qualquer comando, siga os passos:</p>
<ol>
<li><p><strong>Descobrir dispositivos</strong> usando <code>DeviceConnection/DiscoverDevices</code> ou <code>DeviceConnection/GetDevices</code>.</p>
</li>
<li><p><strong>Conectar-se ao dispositivo</strong> usando <code>DeviceConnection/Connect</code>, informando o IP e o <strong>type</strong> correspondente (LiteNet1/2/3).</p>
</li>
</ol>
<h2 id="estrutura-dos-endpoints"><strong>Estrutura dos Endpoints</strong></h2>
<ul>
<li><p><strong>Método</strong>: <code>POST</code></p>
</li>
<li><p><strong>Rota base</strong>: <code>/BasicCommonCommands</code></p>
</li>
<li><p><strong>Parâmetro obrigatório (Body)</strong>: <code>device</code> (objeto do dispositivo LiteNet conectado)</p>
</li>
<li><p><strong>Parâmetro (Query)</strong>: <code>message</code> (string)</p>
</li>
<li><p><strong>Retorno</strong>: <code>DeviceResponse</code></p>
</li>
</ul>

### ReleaseEntry
**Method:** `POST`  
**URL:** `https://localhost:7067/BasicCommonCommands/ReleaseEntry?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 1,
  "type": 1,
  "response": {
    "success": true,
    "message": "Entry released successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 1,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
### ReleaseEntryAndExit
**Method:** `POST`  
**URL:** `https://localhost:7067/BasicCommonCommands/ReleaseEntryAndExit?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 1,
  "type": 1,
  "response": {
    "success": true,
    "message": "Entry released successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 1,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
### ReleaseExit
**Method:** `POST`  
**URL:** `https://localhost:7067/BasicCommonCommands/ReleaseExit?message=Bem-Vindo!`
**Headers:**
- **Content-Type**: `application/json`
**Responses:**
#### 200 OK```json{
  "ip": "192.168.25.55",
  "id": 62,
  "command": 1,
  "type": 1,
  "response": {
    "success": true,
    "message": "Entry released successfully.",
    "data": null
  }
}```
#### 400 Bad Request```json{
  "ip": "192.168.27.196",
  "id": 49,
  "command": 1,
  "type": 1,
  "response": {
    "success": false,
    "message": "Unable to execute the action: device is not in connected. Check if it is registered and accessible.",
    "data": null
  }
}```
---
