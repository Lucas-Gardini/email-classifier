import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Email Classifier")
    .setDescription("Classificador automático de emails com IA")
    .setVersion("1.0.0")
    .addTag("health", "Verificação de saúde da aplicação")
    .addTag("emails", "Operações de listagem e classificação de emails")
    .addServer(process.env.API_BASE_URL ?? "http://localhost:3000", "Servidor padrão")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
