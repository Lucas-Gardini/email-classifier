import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { EmailClassification } from "src/schemas/emails.schema";
import { z } from "zod";

@Injectable()
export class OpenaiService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(OpenaiService.name);
  private readonly openai: OpenAI;
  private defaultModel!: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  onApplicationBootstrap() {
    this.defaultModel = process.env.OPENAI_DEFAULT_MODEL ?? "";
    if (!this.defaultModel) throw new Error("OPENAI_DEFAULT_MODEL is not set");
  }

  async summarizeEmail(subject: string, email: string) {
    this.logger.log(`Summarizing email with subject: ${subject}`);

    const RESPONSE_STRUCTURE = z.object({
      classification: z.nativeEnum(EmailClassification, {
        description: "The classification of the email",
      }),
      summary: z
        .string({
          coerce: true,
          description: "A concise summary of the email content",
        })
        .max(500),
    });

    const SYSTEM_PROMPT = `Você é um assistente que ANALISA e RESUME e-mails e DEVE produzir saída estritamente compatível com o schema.

TAREFAS:
1. CLASSIFICAR o e-mail em exatamente UMA das categorias.
2. Gerar um RESUMO conciso apenas com o conteúdo substancial e importante.

DEFINIÇÕES (Português -> Enum):
- PRODUTIVO (PRODUCTIVE): Requer ação, decisão ou resposta (suporte técnico, acompanhamento de caso, pedido de informação, agendamento, aprovação, bloqueio, cobrança que exige retorno).
- IMPRODUTIVO (UNPRODUCTIVE): Não exige ação imediata (felicitações, agradecimentos simples, mensagem social sem pedido, newsletter genérica, divulgação, confirmação automática sem necessidade de resposta).
- UNCLASSIFIED: Insuficiente/ambíguo, ilegível, corrompido, vazio, decorativo.

REGRAS RÁPIDAS:
- Pedido explícito ou follow-up => PRODUCTIVE.
- Cortesia sem pedido => UNPRODUCTIVE.
- Promo/marketing sem obrigação de resposta => UNPRODUCTIVE.
- Sem contexto útil => UNCLASSIFIED.

RESUMO:
- Manter idioma original.
- Não inventar fatos.
- Remover assinaturas, disclaimers, rodapés legais, descadastro, rastreadores.
- Se promocional: 1 linha com foco da oferta.
- Se sem conteúdo: summary = "Sem conteúdo relevante." e classification = UNCLASSIFIED.

CONSTRANGIMENTOS:
- Não incluir classificação dentro do resumo.
- Não usar markdown, listas ou campos extras.
- Se múltiplos tópicos: priorizar o mais acionável.

Retorne somente dados válidos para o schema.`;

    const response = await this.openai.responses.parse({
      model: this.defaultModel,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Subject: ${subject}\n\n${email}` },
      ],
      text: {
        format: zodTextFormat(RESPONSE_STRUCTURE, "response"),
      },
    });

    if (!response.output_parsed) throw new Error("Failed to parse OpenAI response");

    return response.output_parsed;
  }

  async suggestEmailResponse(subject: string, email: string, classification: EmailClassification) {
    this.logger.log(`Suggesting email response for subject: ${subject}`);

    const RESPONSE_STRUCTURE = z.object({
      suggestedResponse: z.string({ description: "A suggested reply to the email" }).max(500),
    });

    const response = await this.openai.responses.parse({
      model: this.defaultModel,
      input: [{ role: "user", content: `Classification: ${classification}\nSubject: ${subject}\n\n${email}` }],
      text: {
        format: zodTextFormat(RESPONSE_STRUCTURE, "response"),
      },
    });

    if (!response.output_parsed) throw new Error("Failed to parse OpenAI response");

    return response.output_parsed;
  }
}
