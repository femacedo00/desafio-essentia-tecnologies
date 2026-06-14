# TechX - Gerenciamento de tarefas

Este é o repositório do desafio técnico para a Essentia Group. O projeto consiste em um gerenciador de tarefas diárias para a empresa fictícia TechX, estruturado em um formato de Monorepo, separando de forma isolada o Backend (`api`) e o Frontend (`webapp`).

## Estrutura do Projeto

- `api/`: Backend construído com Node.js, Express, TypeScript e arquitetura em camadas.
- `webapp/`: Frontend construído com Angular (v17+).

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão LTS recomendada)
- [npm](https://nodejs.org/) (Instalado com o Node)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose ativos
- [Angular CLI](https://angular.dev/tools/cli) Instalação global opcional, o projeto roda via `npx`

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

## Inicialização do Front-end (WebApp)
A apicação foi desenvolvida em **Angular (v18+)**, gerenciamento de estado reativo com **RxJS** e estilos customizados com **Sass (SCSS)**.

### Passo a Passo para Setup

1. **Navegue até a pasta do front-end** (caso esteja na raiz do repositório):
  ```bash
  cd webapp
  ```

2. **Instale as dependências do projeto:**
  ```bash
  npm install
  ```

3. **Inicie o servidor de desenvolvimento:**
  ```bash
  npm start
  ```

4. **Acesse a aplicação:**
  Abra o seu navegador e acesse `http://localhost:4200`

**Atenção:** Para o ecossistema funcionar por completo, a API Back-end (Express na porta 3000) e os bancos de dados (MySQL e MongoDB) precisam estar ativos antes de realizar as operações do sistema do front-end.

### Mapeamento de Páginas e Segurança (Rotas)
A aplicação utiliza o roteamento para garantir que rotas sensíveis não sejam expostas a usuários anônimos.

| Página | Rota (`URL`) | Descrição | Requer Autenticação? |
| :--- | :--- | :--- | :--- |
| `Login` | `/login` | Tela de autenticação inicial. Captura as credenciais e persiste o token JWT. | Não |
| `Cadastro` | `/register` | Formulário de criação de novas contas. | Não |
| `Dashboard de Tasks` | `/tasks` | Um painel interativo em formato contendo o formulário de criação e edição, e a listagem das tarefas do usuário. | Sim |

### Funcionalidades da Tela de Task

1. **Criação:** Formulário na barra lateral esquerda para o cadastro de uma nova tarefa.
2. **Listagem:** Lista com todos as tarefas cadastradas pelo usuário.
3. **Alteração de estado da tarefa:** Checkbox localizado no card de cada tarefa que indica se a tarefa está concluída ou não.
4. **Edição:** O botão "Editar" no card de cada tarefa carrega os dados do card selecionado de volta para o formulário lateral, alternando a interface para o modo de edição.
5. **Exclusão:** O botão "Excluir" no card de cada tarefa remove a tarefa da listagem permanentemente.
6. **Histórico de alterações da tarefa:** O botão "Histórico" no card de cada tarefa abre um modal e carrega uma linha do tempo detalhando as alterações daquela tarefa específica.
