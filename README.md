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
