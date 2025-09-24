import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { EmailService } from "./email.service";
import { ClassifyEmailDto } from "../async-classifier/dto/classify-email.dto";
import { EmailSearchDto } from "./dto/email-search.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@ApiTags("emails")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get("list")
  @ApiOperation({ summary: "Lista emails com filtros e paginação" })
  @ApiQuery({ name: "subject", required: false, description: "Filtro por assunto (contém)" })
  @ApiQuery({ name: "sender", required: false, description: "Filtro por remetente (contém)" })
  @ApiQuery({ name: "body", required: false, description: "Filtro por texto do corpo (contém)" })
  @ApiQuery({ name: "status", required: false, description: "Status de classificação" })
  @ApiQuery({ name: "page", required: true, description: "Número da página (>=1)", example: 1 })
  @ApiQuery({ name: "limit", required: true, description: "Itens por página (1-100)", example: 20 })
  @ApiOkResponse({
    description: "Lista paginada de emails",
    schema: {
      type: "object",
      properties: {
        items: { type: "array", items: { type: "object" } },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
      },
    },
  })
  async getEmails(@Query() params: Record<string, any>) {
    const dto = plainToInstance(EmailSearchDto, params);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return { error: "Validation failed", details: errors };
    }
    return this.emailService.getEmails(dto);
  }

  @Post("classify")
  @ApiOperation({ summary: "Classifica um email individualmente" })
  @ApiBody({ type: ClassifyEmailDto })
  @ApiOkResponse({
    description: "Resultado da classificação",
    schema: {
      type: "object",
      properties: { success: { type: "boolean" }, data: { type: "string" }, message: { type: "string" } },
    },
  })
  async classifyEmail(@Body() classifyEmailDto: ClassifyEmailDto) {
    return this.emailService.classifyEmail(classifyEmailDto);
  }

  @Post("classify/bulk")
  @ApiOperation({ summary: "Classifica vários emails sequencialmente" })
  @ApiBody({ type: ClassifyEmailDto, isArray: true })
  @ApiOkResponse({
    description: "Status de processamento em lote",
    schema: {
      type: "object",
      properties: {
        processedIndexes: { type: "array", items: { type: "number" } },
        failedIndexes: { type: "array", items: { type: "number" } },
      },
    },
  })
  async classifyEmailBulk(@Body() classifyEmailDtos: ClassifyEmailDto[]) {
    const processingStatus = {
      processedIndexes: [] as number[],
      failedIndexes: [] as number[],
    };

    for (let i = 0; i < classifyEmailDtos.length; i++) {
      try {
        const result = await this.emailService.classifyEmail(classifyEmailDtos[i]);
        if (result.success) {
          processingStatus.processedIndexes.push(i);
        } else {
          processingStatus.failedIndexes.push(i);
        }
      } catch {
        processingStatus.failedIndexes.push(i);
      }
    }

    return processingStatus;
  }
}
