import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Verifica saúde da aplicação" })
  @ApiOkResponse({ description: "Aplicação respondendo", schema: { type: "string", example: "OK" } })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
