# Email Classifier Frontend

Este projeto é o frontend do Email Classifier, uma aplicação web para classificação automática de e-mails utilizando inteligência artificial. Desenvolvido com [Nuxt 3](https://nuxt.com/) e [TypeScript](https://www.typescriptlang.org/).

## Funcionalidades

-   Interface amigável para classificação de e-mails
-   Consumo de API para classificação automática
-   Visualização de resultados de classificação
-   Design responsivo

## Estrutura do Projeto

```
email-classifier.frontend/
├── app/
│   ├── components/         # Componentes Vue reutilizáveis
│   ├── composables/        # Composables para lógica reutilizável
│   ├── pages/              # Páginas da aplicação
│   ├── plugins/            # Plugins Nuxt
│   └── utils/              # Funções utilitárias e tipos
├── public/                 # Arquivos públicos (favicon, robots.txt, etc)
├── assets/                 # Arquivos estáticos (CSS, imagens, lottie)
├── nuxt.config.ts          # Configuração do Nuxt
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
└── README.md               # Este arquivo
```

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/Lucas-Gardini/email-classifier.git
    cd email-classifier/email-classifier.frontend
    ```
2. Instale as dependências:
    ```sh
    npm install
    ```

## Executando o Projeto

Para rodar o ambiente de desenvolvimento:

```sh
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

-   `npm run dev` — Inicia o servidor de desenvolvimento
-   `npm run build` — Gera a versão de produção
-   `npm run preview` — Visualiza a build de produção localmente
-   `npm run lint` — Executa o linter

## Configuração

-   As configurações principais estão em `nuxt.config.ts`.
-   Variáveis de ambiente podem ser definidas em `.env`.

## Contribuição

Pull requests são bem-vindos! Para contribuir:

1. Crie um fork do projeto
2. Crie uma branch para sua feature ou correção
3. Envie um pull request

## Licença

Este projeto está sob a licença MIT.
