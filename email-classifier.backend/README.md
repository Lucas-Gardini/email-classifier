# Email Classifier - Backend

API para ingestão, classificação assíncrona e sugestão de resposta para e-mails usando OpenAI.

---

## 🚀 Visão Geral

Este serviço recebe e-mails (assunto, remetente e corpo), armazena, classifica-os em categorias (productive | unproductive | unclassified), gera um resumo e produz uma sugestão de resposta assistida por IA. O processamento da classificação é **assíncrono** via fila (BullMQ + Redis), permitindo alta resiliência e desacoplamento entre ingestão e enriquecimento.

## 🧠 Principais Funcionalidades

- Cadastro de e-mails para classificação (imediata na fila)
- Classificação automática via OpenAI (prompt estruturado + validação de schema com Zod)
- Geração de resumo conciso do conteúdo
- Sugestão de resposta adequada ao contexto
- Consulta paginada e filtrada de e-mails com enriquecimento (resumo + sugestão)

## 🏗️ Arquitetura (High-Level)

```text
[Client] --> (HTTP) --> [NestJS API]
	|  POST /email/classify
	|--> Persiste Email (status = pending)
	|--> Enfileira Job "classify-email" -----> [BullMQ Queue / Redis] ----> [Worker AsyncClassifier]
																												|                     |
																												| (fetch email)       |
																												|--> OpenAI (summarize + suggest)
																												|--> Atualiza Email (status=classified, classification, link para suggestion)
																												|--> Upsert EmailSuggestion
```

## 📦 Tecnologias Utilizadas

| Categoria            | Ferramenta                                |
| -------------------- | ----------------------------------------- |
| Runtime              | Node.js (TypeScript)                      |
| Framework            | NestJS 11                                 |
| Fila                 | BullMQ + Redis (via `@nestjs/bullmq`)     |
| Banco de Dados       | MongoDB (Mongoose 8)                      |
| IA                   | OpenAI Responses API + Zod Parsing        |
| Validação            | class-validator / class-transformer / Zod |
| Documentação         | Swagger (`@nestjs/swagger`)               |
| Tipagem de respostas | semantic-response                         |
| Config/env           | @nestjs/config + auto-type-env            |
| Lint/Format          | ESLint 9 + Prettier 3                     |

## 🔄 Fluxo de Processamento

1. Cliente envia POST `/email/classify` com (subject?, sender?, body)
2. API salva documento `Email` (status=pending, classification=unclassified)
3. Job é enviado para fila `async-classifier`
4. Worker (`AsyncClassifierConsumer`) consome o job e chama `AsyncClassifierService`
5. Serviço chama OpenAI duas vezes: (a) summarize/classify (b) sugestão de resposta
6. Upsert em `EmailSuggestion` + atualização do Email (status=classified, classification, suggestion ref)
7. Consulta posterior (`GET /email/list`) retorna dados enriquecidos (populate suggestion)

## 🗂️ Estrutura de Pastas (principal)

```text
src/
	main.ts                # Bootstrap Nest
	app.module.ts          # Módulo raiz
	modules/
		email/               # Endpoints de listagem e ingestão
		async-classifier/    # Worker + serviço assíncrono
		openai/              # Integração com OpenAI (summarize + suggest)
	schemas/               # Schemas Mongoose (Email, EmailSuggestion)
```

## 🧾 Modelos (Schemas)

### Email

| Campo          | Tipo                                         | Observações                   |
| -------------- | -------------------------------------------- | ----------------------------- |
| subject        | string                                       | indexado, opcional no DTO     |
| sender         | string                                       | indexado, opcional no DTO     |
| body           | string                                       | conteúdo do e-mail            |
| status         | enum(pending\|classified\|error)             | default: pending              |
| classification | enum(productive\|unproductive\|unclassified) | default: unclassified         |
| suggestion     | ref EmailSuggestion                          | preenchido após processamento |

### EmailSuggestion

| Campo             | Tipo                | Observações                     |
| ----------------- | ------------------- | ------------------------------- |
| email             | ObjectId(ref Email) | 1-1 (upsert)                    |
| summary           | string              | resumo conciso (até ~500 chars) |
| suggestedResponse | string              | resposta sugerida               |

## 📩 DTOs Principais

### ClassifyEmailDto

```jsonc
{
  "subject": "Reunião de status", // opcional
  "sender": "joao@empresa.com", // opcional
  "body": "Olá, precisamos alinhar...", // obrigatório
}
```

### EmailSearchDto (query params)

| Param   | Tipo                     | Exemplo         | Descrição                              |
| ------- | ------------------------ | --------------- | -------------------------------------- |
| subject | string                   | relatório       | Filtro contém (regex case-insensitive) |
| sender  | string                   | maria@          | Filtro contém                          |
| body    | string                   | seguem os dados | Filtro contém                          |
| status  | pending/classified/error | classified      | Filtra por status                      |
| page    | number >=1               | 1               | Página                                 |
| limit   | 1-100                    | 20              | Tamanho página                         |

## 🔌 Endpoints (Resumo)

| Método | Rota                   | Descrição                                            |
| ------ | ---------------------- | ---------------------------------------------------- |
| GET    | `/email/list`          | Lista e-mails paginados + suggestion populate        |
| POST   | `/email/classify`      | Enfileira classificação de um e-mail                 |
| POST   | `/email/classify/bulk` | Processa vários em sequência (não usa fila por item) |

Swagger disponível (quando configurado) em: `/api` (ajuste conforme seu `main.ts`).

## ⚙️ Variáveis de Ambiente

| Nome                   | Obrigatório | Descrição                                                       |
| ---------------------- | ----------- | --------------------------------------------------------------- |
| `OPENAI_API_KEY`       | ✅          | Chave da API OpenAI                                             |
| `OPENAI_DEFAULT_MODEL` | ✅          | Modelo (ex: `gpt-4.1-mini` ou similar compatível Responses API) |
| `MONGODB_URI`          | ✅          | String de conexão MongoDB                                       |
| `REDIS_HOST`           | ✅          | Host Redis para BullMQ                                          |
| `REDIS_PORT`           | ✅          | Porta Redis (ex: 6379)                                          |
| `REDIS_PASSWORD`       | ❌          | Se seu Redis exigir auth                                        |

Recomenda-se criar um arquivo `.env` e rodar `npm run gen:env` para gerar tipagem (`environment.d.ts`).

## 🐳 Execução com Docker Compose

Arquivo: `docker-compose.yml` (ajuste se necessário)

Passos:

```bash
docker compose up -d --build
```

Isso deve subir: API + Redis + (Mongo se definido). Certifique-se de configurar o serviço Mongo no compose caso ainda não exista.

## ▶️ Execução Local (sem Docker)

Pré-requisitos:

- Node.js 20+
- MongoDB em execução
- Redis em execução

Instalação:

```bash
npm install
```

Rodar dev:

```bash
npm run start:dev
```

Build + produção:

```bash
npm run build
npm run start:prod
```

## 🧪 Testes (Sugestão Futuras Implementações)

Ainda não há suíte de testes. Sugestão:

- Unit: OpenaiService (mocks), AsyncClassifierService
- E2E: fluxo POST classify -> worker -> GET list

## 🛡️ Observabilidade & Logs

- Uso do `Logger` nativo Nest em pontos críticos (classificação / sugestão)
- Sugestão futura: adicionar métricas (Prometheus) e tracing (OpenTelemetry)

## 🚧 Roadmap Sugerido

- [ ] Endpoint para reprocessar e-mail com erro
- [ ] Cancelamento/remoção de e-mail pendente
- [ ] Filtro por classificação final
- [ ] Paginação cursor-based para grandes volumes
- [ ] Autenticação (JWT / Key) e rate limiting
- [ ] Testes automatizados (unit + e2e)
- [ ] Cache de respostas OpenAI para conteúdos idempotentes
- [ ] Webhook/WS para notificar cliente quando classificação concluir
- [ ] Retentativa automática em caso de falha OpenAI

## 🔐 Boas Práticas / Notas

- Não exponha diretamente a `OPENAI_API_KEY`
- Trate limites de custo da API (rate / budget)
- Sanitização de input já mitigada via DTO + regex escape
- Corpo do e-mail pode ser grande: avaliar size limits / compressão

## 🤝 Contribuição

1. Fork
2. Branch: `feat/nome-funcionalidade`
3. Commit semântico (ex: `feat: adiciona filtro por classification`)
4. PR com descrição clara
