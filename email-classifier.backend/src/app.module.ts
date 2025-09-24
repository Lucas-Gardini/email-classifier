import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "./schemas/database.module";
import { BullModule } from "@nestjs/bullmq";
import { EmailModule } from "./modules/email/email.module";
import { AsyncClassifierModule } from "./modules/async-classifier/async-classifier.module";
import { OpenaiModule } from "./modules/openai/openai.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: +process.env.REDIS_PORT || 6379,
      },
    }),
    AsyncClassifierModule,
    DatabaseModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
