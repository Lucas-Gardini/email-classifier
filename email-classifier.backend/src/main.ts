import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Email Classifier")
    .setDescription("Classificador automático de emails com IA")
    .setVersion("1.0.0")
    .addTag("health", "Verificação de saúde da aplicação")
    .addTag("emails", "Operações de listagem e classificação de emails")
    .addServer(process.env.API_BASE_URL ?? "http://localhost:3001", "Servidor padrão")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.BACK_PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger is running on: ${await app.getUrl()}/api`);
  console.log(`CORS allowed origin: ${process.env.CORS_ORIGIN}`);
}
void bootstrap();
