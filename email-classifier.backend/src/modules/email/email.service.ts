import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { HttpResponse, IServiceResponse } from "semantic-response";
import { Email, EmailClassificationStatus } from "src/schemas/emails.schema";
import { ClassifyEmailDto } from "../async-classifier/dto/classify-email.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { EmailSearchDto } from "./dto/email-search.dto";

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    @InjectQueue("async-classifier") private audioQueue: Queue,
  ) {}

  private escapeRegex(input: string) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  async getEmails(emailSearchDto: EmailSearchDto): Promise<IServiceResponse<Email[]>> {
    const filter: Partial<Record<keyof Email, any>> & { status?: EmailClassificationStatus } = {};

    if (emailSearchDto.subject) {
      filter.subject = { $regex: this.escapeRegex(emailSearchDto.subject), $options: "i" };
    }
    if (emailSearchDto.sender) {
      filter.sender = { $regex: this.escapeRegex(emailSearchDto.sender), $options: "i" };
    }
    if (emailSearchDto.body) {
      filter.body = { $regex: this.escapeRegex(emailSearchDto.body), $options: "i" };
    }
    if (emailSearchDto.status) filter.status = emailSearchDto.status;

    const projection = { __v: 0 };

    const emails = await this.emailModel
      .find(filter, projection)
      .populate({
        path: "suggestion",
        select: "-_id -__v -email -createdAt -updatedAt",
      })
      .skip((emailSearchDto.page - 1) * emailSearchDto.limit)
      .limit(emailSearchDto.limit)
      .lean()
      .exec();

    return HttpResponse.ok(emails);
  }

  async classifyEmail(classifyEmailDto: ClassifyEmailDto): Promise<IServiceResponse<Types.ObjectId>> {
    const email = new this.emailModel(classifyEmailDto);
    await email.save();

    await this.audioQueue.add("classify-email", { emailId: email._id });

    return HttpResponse.ok(email._id, "Email enviado para classificação.");
  }
}
