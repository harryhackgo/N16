import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.API_URL}/api/users/activate/${user.activationLink}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Activate your account OnlineMarket",
      template: "./confirmation",
      context: {
        name: user.name,
        url,
      },
    });
  }
}