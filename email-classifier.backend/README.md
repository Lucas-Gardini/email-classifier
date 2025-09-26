# Email Classifier Backend

Este projeto é um backend desenvolvido em NestJS para classificação automática de e-mails, geração de resumos e sugestão de respostas, utilizando a API da OpenAI.

## Funcionalidades

- **Classificação de e-mails**: Classifica e-mails em três categorias: PRODUCTIVE (produtivo), UNPRODUCTIVE (improdutivo) e UNCLASSIFIED (não classificado), com base em regras corporativas e contexto do conteúdo.
- **Resumo automático**: Gera um resumo conciso do conteúdo do e-mail, removendo informações irrelevantes e mantendo apenas o essencial.
- **Sugestão de resposta**: Sugere respostas automáticas adequadas ao contexto e classificação do e-mail.
- **Processamento assíncrono**: Suporte a processamento assíncrono de classificação via fila.

## Estrutura do Projeto

```
email-classifier.backend/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── modules/
│   │   ├── async-classifier/
│   │   ├── email/
│   │   └── openai/
│   └── schemas/
│       ├── database.module.ts
│       ├── email-suggestion.schema.ts
│       └── emails.schema.ts
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── ...
```

## Como executar localmente

1. **Pré-requisitos:**
   - Node.js 18+
   - Docker (opcional, para banco de dados ou serviços auxiliares)
   - Chave de API da OpenAI

2. **Instalação:**

   ```sh
   npm install
   ```

3. **Configuração:**
   - Crie um arquivo `.env` na raiz do projeto com as variáveis:
     ```env
     OPENAI_API_KEY=your_openai_key
     OPENAI_DEFAULT_MODEL=gpt-4o
     ```

4. **Execução:**

   ```sh
   npm run start:dev
   ```

5. **Testes:**
   ```sh
   npm run test
   ```

## Principais Endpoints

- `GET /email/list` — Lista todos os e-mails classificados.
- `POST /email/classify` — Classifica e resume um e-mail.

## Observações

- O projeto utiliza Zod para validação de schemas e integração com a OpenAI.
- As regras de classificação são orientadas para uso corporativo, evitando classificar como produtivo qualquer conteúdo informal ou fora do contexto de trabalho.

## Licença

MIT
