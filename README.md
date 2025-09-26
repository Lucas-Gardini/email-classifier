<div align="center">
  <h1>Email Classifier</h1>
  <p>Projeto fullstack para classificação automática de e-mails utilizando IA (OpenAI) e interface web moderna.</p>
</div>

---

## Índice

-   [Sobre o Projeto](#sobre-o-projeto)
-   [Estrutura do Projeto](#estrutura-do-projeto)
-   [Tecnologias Utilizadas](#tecnologias-utilizadas)
-   [Como Rodar o Projeto](#como-rodar-o-projeto)
    -   [Backend](#backend)
    -   [Frontend](#frontend)
-   [Licença](#licença)

---

## Sobre o Projeto

O **Email Classifier** é uma aplicação composta por backend (NestJS) e frontend (Nuxt 3) para classificação automática de e-mails, utilizando modelos de IA (OpenAI) e arquitetura moderna. O sistema permite classificar, buscar e sugerir categorias para e-mails, facilitando a organização e automação de fluxos de trabalho.

## Estrutura do Projeto

```
email-classifier/
├── email-classifier.backend/   # Backend NestJS (API, processamento, integração OpenAI)
└── email-classifier.frontend/  # Frontend Nuxt 3 (interface web)
```

## Tecnologias Utilizadas

-   **Backend:**
    -   [NestJS](https://nestjs.com/) (Node.js, TypeScript)
    -   OpenAI API
    -   MongoDB (via Mongoose)
    -   Docker Compose
-   **Frontend:**
    -   [Nuxt 3](https://nuxt.com/) (Vue 3, TypeScript)
    -   NuxtUI
    -   Tailwind CSS

## Como Rodar o Projeto

### Pré-requisitos

-   Node.js 18+
-   Docker e Docker Compose (para o backend)

### Backend

1. Acesse a pasta do backend:
    ```sh
    cd email-classifier.backend
    ```
2. Copie o arquivo de variáveis de ambiente:
    ```sh
    cp .env.example .env
    ```
    > Edite o `.env` conforme necessário (chave da OpenAI, string do MongoDB, etc).
3. Suba os serviços com Docker Compose:
    ```sh
    docker-compose up -d
    ```
4. Instale as dependências:
    ```sh
    npm install
    ```
5. Rode o servidor de desenvolvimento:
    ```sh
    npm run start:dev
    ```
    O backend estará disponível em `http://localhost:3001`.

### Frontend

1. Acesse a pasta do frontend:
    ```sh
    cd email-classifier.frontend
    ```
2. Instale as dependências:
    ```sh
    npm install
    ```
3. Copie o arquivo de variáveis de ambiente:
    ```sh
    cp .env.example .env
    ```
    > Edite o `.env` conforme necessário (endpoint do backend, etc).
4. Rode o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```
    O frontend estará disponível em `http://localhost:3000` (ou porta configurada).

## Licença

Este projeto está sob a licença MIT.
