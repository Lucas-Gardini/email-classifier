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

  async getEmails(emailSearchDto: EmailSearchDto): Promise<IServiceResponse<Email[]> | IServiceResponse> {
    const filter: Partial<Record<keyof Email, any>> & { _id?: Types.ObjectId; status?: EmailClassificationStatus } = {};

    if (emailSearchDto.id) {
      if (Types.ObjectId.isValid(emailSearchDto.id)) {
        filter._id = new Types.ObjectId(emailSearchDto.id);
      } else {
        return HttpResponse.badRequest(undefined, "ID de email inválido.");
      }
    }
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

    const [items, total] = await Promise.all([
      this.emailModel
        .find(filter, projection)
        .sort({ createdAt: -1 })
        .populate({
          path: "suggestion",
          select: "-_id -__v -email -createdAt -updatedAt",
        })
        .skip((emailSearchDto.page - 1) * emailSearchDto.limit)
        .limit(emailSearchDto.limit)
        .lean()
        .exec(),
      this.emailModel.countDocuments(filter),
    ]);

    const data = {
      items,
      total,
      page: emailSearchDto.page,
      limit: emailSearchDto.limit,
    };

    return HttpResponse.ok(data, "Emails encontrados com sucesso.");
  }

  async classifyEmail(classifyEmailDto: ClassifyEmailDto): Promise<IServiceResponse<Types.ObjectId>> {
    const email = new this.emailModel(classifyEmailDto);
    await email.save();

    await this.audioQueue.add("classify-email", { emailId: email._id });

    return HttpResponse.ok(email._id, "Email enviado para classificação.");
  }
}
