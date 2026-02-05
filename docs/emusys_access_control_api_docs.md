# Proposta de API - Controle de Acesso - Emusys

# 🔐 API – Controle de Acesso (Integração com Catraca)

Esta API permite integrar o ERP com um sistema de catraca, realizando:

- Identificação de pessoas por token
- Cadastro e remoção de tokens
- Registro de presença em aulas
- Consulta de pessoas cadastradas

---

## 📌 Informações Gerais

- **Base URL:** `/controle_de_acesso`
- **Formato:** JSON
- **Autenticação:** (definir se houver)
- **Grupo:** Controle de Acesso

---

## 📦 Modelo de Dados

### PessoaControleAcesso

```json
{
"id":123,
"nome":"João da Silva",
"token":"ABC123"
}

```

> O campo token pode ser null ou ausente caso a pessoa não possua token cadastrado.
> 

---

## 👥 Listar Pessoas

### `GET /controle_de_acesso/pessoas`

Lista pessoas cadastradas no sistema.

### Parâmetros de Query

| Nome | Tipo | Obrigatório | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `somenteComToken` | boolean | não | false | Retorna apenas pessoas com token |
| `busca` | string | não | — | Busca case-insensitive pelo nome |

### Exemplo de Requisição

```
GET /controle_de_acesso/pessoas?somenteComToken=true&busca=joao

```

### Resposta – 200 OK

```json
{
"pessoas":[
{
"id":1,
"nome":"João da Silva",
"token":"ABC123"
}
]
}

```

---

## 🔑 Cadastrar / Substituir Token

### `POST /controle_de_acesso/token`

Cadastra ou substitui o token de uma pessoa.

### Corpo da Requisição

```json
{
"id":1,
"token":"ABC123"
}

```

### Resposta – 200 OK

Token cadastrado ou atualizado com sucesso.

---

## ❌ Remover Token

### `DELETE /controle_de_acesso/token`

Remove o token de uma pessoa.

Se a pessoa não tiver token, a operação retorna sucesso normalmente.

### Corpo da Requisição

```json
{
"id":1
}

```

### Resposta – 200 OK

Token removido ou inexistente.

---

## 🕒 Registrar Presença

### `POST /controle_de_acesso/registrar_presenca`

Registra a presença de uma pessoa na catraca.

A identificação pode ser feita por **id**, **token** ou ambos.

Se ambos forem enviados, o sistema valida se pertencem à mesma pessoa.

### Corpo da Requisição

```json
{
"id":234,
"token":"ABC123",
"permitirInadimplente":false
}

```

### Regras Importantes

- Se `permitirInadimplente = false`:
    - Retorna erro se a pessoa **ou algum dependente** estiver inadimplente
- Retorna erro se:
    - Token e ID não corresponderem à mesma pessoa
    - Não houver aula agendada no momento

### Resposta – 200 OK

```json
{
"pessoa":{
"id":1,
"nome":"João da Silva",
"token":"ABC123"
},
"horarioAula":"2026-01-16T18:00:00",
"curso":"Violão Iniciante",
"professor":"Carlos Pereira"
}

```

### Resposta – 400 Erro de Regra de Negócio

```json
{
"codigo":"DEPENDENTE_INADIMPLENTE",
"mensagem":"Existe um dependente inadimplente impedindo o acesso."
}

```

### Possíveis códigos de erro

- `PESSOA_INADIMPLENTE`
- `DEPENDENTE_INADIMPLENTE`
- `SEM_AGENDAMENTO_ATUAL`
- `TOKEN_E_ID_NAO_CORRESPONDEM`

---

## 🪪 Identificar Pessoa pelo Token

### `POST /controle_de_acesso/identificar`

Identifica uma pessoa exclusivamente pelo token.

### Corpo da Requisição

```json
{
"token":"ABC123",
"somenteAlunosOuResponsaveisAtivos":true
}

```

### Regras

- Alunos e responsáveis devem estar ativos
- Professores e usuários do sistema só são aceitos se ativos

### Resposta – 200 OK

```json
{
"id":1,
"nome":"João da Silva",
"token":"ABC123"
}

```

### Resposta – 404 Not Found

Token não encontrado.

---

## ✅ Observações Finais

- API pensada para **integração simples com hardware de catraca**
- Erros retornam mensagens **prontas para exibição ao usuário final**
- Contrato propositalmente enxuto para reduzir erros de integração
