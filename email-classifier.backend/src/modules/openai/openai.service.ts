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
2. Gerar um RESUMO conciso apenas com o conteúdo substancial e importante, em texto plano.

DEFINIÇÕES (Português -> Enum):
- PRODUTIVO (PRODUCTIVE): Apenas para e-mails sérios, relacionados a trabalho, assuntos corporativos ou temas realmente importantes (ex: decisões, solicitações de trabalho, suporte técnico, cobranças, aprovações, bloqueios, informações críticas). Convites informais, eventos sociais, mensagens pessoais ou qualquer assunto fora do escopo corporativo NÃO devem ser classificados como PRODUCTIVE.
- IMPRODUTIVO (UNPRODUCTIVE): Não exige ação imediata ou não é relevante para o trabalho (felicitações, agradecimentos simples, convite informal, mensagem social, newsletter genérica, divulgação, confirmação automática sem necessidade de resposta, temas pessoais ou fora do contexto corporativo).
- UNCLASSIFIED: Insuficiente/ambíguo, ilegível, corrompido, vazio, decorativo.

REGRAS RÁPIDAS:
- Só classifique como PRODUCTIVE se for algo sério, de trabalho ou importante
- Convite informal, evento social ou tema pessoal ➜ UNPRODUCTIVE
- Cortesia sem pedido ➜ UNPRODUCTIVE
- Promo/marketing sem obrigação de resposta ➜ UNPRODUCTIVE
- Sem contexto útil ➜ UNCLASSIFIED
- Responda sempre em Português

RESUMO:
- Manter idioma original
- NÃO inventar fatos
- Remover assinaturas, disclaimers, rodapés legais, descadastro, rastreadores
- Se promocional: destacar a oferta principal no texto
- Se sem conteúdo: summary = "Sem conteúdo relevante." e classification = UNCLASSIFIED
- Use frases claras e objetivas
- Use \n para separar tópicos ou itens quando apropriado

CONSTRANGIMENTOS:
- Não incluir classificação dentro do resumo
- NÃO usar formatação Markdown
- Se múltiplos tópicos: priorizar o mais acionável

Retorne somente dados válidos para o schema com summary em texto plano, sem formatação Markdown, mas pode usar \n para separar tópicos.`;

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
      suggestedResponse: z
        .string({
          description: "A suggested reply to the email",
        })
        .max(500),
    });

    const SYSTEM_PROMPT = `Você é um assistente especializado em SUGERIR RESPOSTAS para e-mails e DEVE produzir saída estritamente compatível com o schema.

TAREFA:
Gerar uma RESPOSTA SUGERIDA apropriada baseada na classificação e conteúdo do e-mail.

DIRETRIZES POR CLASSIFICAÇÃO:

PRODUCTIVE (E-mails que requerem ação):
- Resposta deve ser profissional e direta
- Abordar especificamente o que foi solicitado
- Incluir próximos passos quando apropriado
- Tom colaborativo e solucionador

UNPRODUCTIVE (E-mails de cortesia/informativos):
- Resposta deve ser cordial e breve
- Agradecer quando apropriado
- Confirmar recebimento se necessário
- Tom amigável mas conciso

UNCLASSIFIED (E-mails ambíguos):
- Resposta deve solicitar esclarecimentos
- Ser educado e profissional
- Oferecer alternativas de contato se necessário

REGRAS GERAIS:
- Manter tom profissional e cordial
- Responder sempre em Português
- Ser específico ao conteúdo do e-mail
- Evitar respostas genéricas
- Não incluir assinaturas ou rodapés
- Máximo 500 caracteres
- Ser direto e objetivo

FORMATAÇÃO:
- NÃO usar formatação Markdown na resposta
- Use quebras de linha (\n) quando necessário para organizar o texto
- Separe parágrafos ou ideias diferentes com quebras de linha
- Mantenha texto limpo e legível

CONSTRANGIMENTOS:
- NÃO inventar informações não mencionadas no e-mail original
- NÃO fazer promessas que não podem ser cumpridas
- NÃO incluir dados pessoais ou confidenciais
- Manter contexto do assunto original
- NÃO usar formatação Markdown (negrito, itálico, listas, etc.)

Retorne somente a resposta sugerida válida para o schema, em texto plano, sem formatação Markdown, mas pode usar \n para separar ideias quando necessário.`;

    const response = await this.openai.responses.parse({
      model: this.defaultModel,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Classification: ${classification}\nSubject: ${subject}\n\n${email}` },
      ],
      text: {
        format: zodTextFormat(RESPONSE_STRUCTURE, "response"),
      },
    });

    if (!response.output_parsed) throw new Error("Failed to parse OpenAI response");

    return response.output_parsed;
  }
}
