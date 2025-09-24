import { Injectable } from "@nestjs/common";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { AsyncClassifierService } from "./async-classifier.service";

@Injectable()
@Processor("async-classifier")
export class AsyncClassifierConsumer extends WorkerHost {
  constructor(private readonly asyncClassifierService: AsyncClassifierService) {
    super();
  }

  async process(job: Job<{ emailId: string }, any, string>): Promise<any> {
    switch (job.name) {
      case "classify-email":
        await this.asyncClassifierService.classifyEmail(job.data.emailId);
        break;
    }

    return {};
  }
}
