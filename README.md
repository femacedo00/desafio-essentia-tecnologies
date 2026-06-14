# TechX - To-Do List Manager

Este é o repositório do desafio técnico para a Essentia Group. O projeto consiste em um gerenciador de tarefas diárias para a empresa fictícia TechX, estruturado em um formato de Monorepo, separando de forma isolada o Backend (`api`) e o Frontend (`webapp`).

## Estrutura do Projeto

- `api/`: Backend construído com Node.js, Express, TypeScript e arquitetura em camadas.
- `webapp/`: Frontend construído com Angular (v17+).

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão LTS recomendada)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose ativos

---

## Ambiente de Banco de Dados (Docker)

O projeto utiliza dois ambientes de banco de dados isolados em containers para garantir a consistência dos dados localmente:
1. **MySQL:** Responsável pela persistência e gerenciamento das tarefas.
2. **MongoDB:** Utilizado para o armazenamento de logs de cada tarefa.

### Como inicializar os bancos de dados:

1. Navegue até o diretório do backend:
   ```bash
   cd api
   ```

2. Crie o seu arquivo de variáveis de ambiente com base no modelo fornecido:
   ```bash
   cp .env.example .env
   ```
   (Nota: Caso necessário, preencha as credenciais no arquivo ``.env`` gerado).

3. Execute o comando do Docker Compose para baixar as imagens oficiais e iniciar os containers em segundo plano:
   ```bash
   docker compose up -d
   ```

4. Para verificar se os containers estão ativos e saudáveis, execute:
   ```bash
   docker ps
   ```

## Inicialização do Backend (api)

O backend foi desenvolvido utilizando **TypeScript** de forma totalmente local, eliminando a necessidade de instalações globais na máquina que avalia o projeto.

### Instalação de Dependências

Para instalar o TypeScript, as definições de tipos (@types/node) e todas as dependências do servidor Express do projeto, garanta que está na pasta correta e execute:
   ```bash
   cd api
   npm install
   ```

### Scripts Disponíveis (package.json)

Dentro do diretório ``api``, os seguintes comandos estão configurados para gerenciar o ciclo de vida da aplicação:

* ``npm run build``: Executa o compilador do TypeScript (``tsc``) local utilizando o ``npx`` por debaixo dos panos, transpilando o código TS da pasta para JavaScript puro dentro do diretório de distribuição.

* ``npm start``: Inicializa o servidor em ambiente de produção utilizando o Node.js a partir do ponto de entrada principal do projeto.

## Guia de Rotas da API

Todas as requisições devem conter o cabeçalho `Content-Type: application/json`. As rotas de tarefas exigem autenticação via Token JWT.

### Rotas de Autenticação (`/users`)

Responsável pelo gerenciamento de acesso dos usuários no sistema.

| Método | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Cadastro de um novo usuário no sistema | Não |
| `POST` | `/users/login` | Autenticação do usuário e geração do Token JWT | Não |

#### 1. Cadastro de Usuário
* **Endpoint:** `POST /users/register`
* **Corpo da Requisição (Body JSON):**
```json
{
  "name": "Felipe Oliveira",
  "email": "felipe@exemplo.com",
  "password": "senha_segura_aqui"
}
```
* **Resposta de Sucesso (201 Created):**
```json
{
  "status": "success",
  "data": {
      "name": "Felipe Oliveira",
      "email": "felipe@exemplo.com",
      "createdAt": "aaaa-mm-ddThh:mm:ss.000Z",
      "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z"
    }
}
```

#### 2. Login de Usuário
* **Endpoint:** `POST /users/login`
* **Corpo da Requisição (Body JSON):**
```json
{
  "email": "felipe@exemplo.com",
  "password": "senha_segura_aqui"
}
```
* **Resposta de Sucesso (200 OK):**
```json
{
    "status": "success",
    "data": {
      "user": {
         "name": "Felipe Oliveira",
         "email": "felipe@exemplo.com",
         "createdAt": "aaaa-mm-ddThh:mm:ss.000Z",
         "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z",
         "deletedAt": null
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```
**Nota de Teste:** Copie o token retornado nesta rota e adicione-o como um cabeçalho de autorização (Authorization: Bearer <seu_token>) para conseguir testar as rotas de tarefas abaixo.

### Rotas de Tarefas (`/tasks`)

**Importante:** Todas as rotas abaixo exigem o Bearer Token no cabeçalho da requisição e operam de forma isolada por usuário logado.

| Método | Endpoint | Descrição | Comportamento de Log |
| :--- | :--- | :--- | :--- |
| `POST` | `/tasks` | Cria uma nova tarefa vinculada ao usuário | **Grava** `CREATE` no MongoDB |
| `GET` | `/tasks` | Lista apenas as tarefas do usuário logado | Apenas Leitura (MySQL) |
| `PATCH` | `/tasks/:id` | Atualiza dinamicamente colunas de uma tarefa | Grava `UPDATE` no MongoDB |
| `DELETE` | `/tasks/:id` | Remove uma tarefa específica do usuário | Grava `DELETE` no MongoDB |
| `GET` | `/tasks/:id` |,Retorna o histórico de uma determinada | Busca direto do MongoDB |

#### 1. Criar Tarefa
* **Endpoint:** `POST /tasks`
* **Corpo da Requisição (Body JSON):**
```json
{
  "title": "Finalizar a documentação do README",
  "description": "Adicionar as especificações de payload e rotas"
}
```
* **Ação Interna:** Salva o registro estruturado no MySQL e dispara um Hook assíncrono salvando um documento de auditoria na coleção do MongoDB.
* **Resposta de Sucesso (201 Created):**
```json
{
  "status": "success",
  "data": {
      "task": {
         "id": number,
         "title": "Finalizar a documentação do README",
         "description": "Adicionar as especificações de payload e rotas",
         "completed": boolean,
         "createdAt": "aaaa-mm-ddThh:mm:ss.000Z",
         "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z"
      }
   }
}
```

#### 2. Listar Todas as Tarefas
* **Endpoint:** `GET /tasks`
* **Filtro Nativo:** Retorna estritamente as tarefas pertencentes ao ID do usuário decodificado no token.
* **Resposta de Sucesso (200 OK):**
```json
{
  "status": "success",
  "data": {
      "tasks":[
         {
            "id": number,
            "title": "Finalizar a documentação do README",
            "description": "Adicionar as especificações de payload e rotas",
            "completed": false,
            "createdAt": "aaaa-mm-ddThh:mm:ss.000Z",
            "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z"
         }
      ]
   }
}
```

#### 3. Atualização Parcial de Tarefa
* **Endpoint:** `PATCH /tasks/:id`
* **Corpo da Requisição (Body JSON):** Você pode enviar `apenas` a chave que deseja alterar (title, description, completed). O validador aceita modificações parciais sem resetar os outros campos no MySQL.
```json
{
  "completed": true
}
```
* **Resposta de Sucesso (200 OK):**
```json
{
  "status": "success",
  "data": {
      "task": {
         "id": number,
         "title": "Finalizar a documentação do README",
         "description": "Adicionar as especificações de payload e rotas",
         "completed": true,
         "createdAt": "aaaa-mm-ddThh:mm:ss.000Z",
         "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z",
         "deletedAt": null
      }
   }
}
```
* **Ação Interna:** Atualiza a coluna no MySQL e o Hook do Sequelize intercepta o estado anterior (old) e o novo estado (new), enviando o histórico de modificações detalhado para o MongoDB.

#### 4. Exclusão de Tarefa
* **Endpoint:** `DELETE /tasks/:id`
* **Resposta de Sucesso (200 OK):**
```json
{
  "status": "success",
  "message": "Tarefa deletada com sucesso."
}
```
* **Ação Interna:** Atualiza a coluna deletedAt no banco do MySQL (`soft delete`) e adiciona uma entrada do tipo DELETE contendo o último estado do objeto no MongoDB para fins de histórico. 

#### 5. Consultar Histórico da Tarefa
* **Endpoint:** `GET /tasks/:id/log`
* **Resposta de Sucesso (200 OK):** Consome a coleção do MongoDB, ordenando do evento mais recente para o mais antigo.
```json
{
  "status": "success",
  "data": {
    "history": [
      {
        "id": string,
        "taskId": number,
        "userId": number,
        "action": "UPDATE",
        "changes": {
          "completed": { "old": false, "new": true }
        },
        "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z"
      },
      {
        "id": string,
        "taskId": number,
        "userId": number,
        "action": "CREATE",
        "changes": {
            "title": "Finalizar a documentação do README",
            "description": "Adicionar as especificações de payload e rotas"
        },
        "updatedAt": "aaaa-mm-ddThh:mm:ss.000Z"
      }
    ]
  }
}
```