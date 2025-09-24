import { Global, Module } from "@nestjs/common";
import { AsyncClassifierConsumer } from "./async-classifier.consumer";
import { BullModule } from "@nestjs/bullmq";
import { AsyncClassifierService } from "./async-classifier.service";
import { OpenaiModule } from "../openai/openai.module";

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: "async-classifier",
    }),
    OpenaiModule,
  ],
  controllers: [],
  providers: [AsyncClassifierConsumer, AsyncClassifierService],
  exports: [BullModule],
})
export class AsyncClassifierModule {}
