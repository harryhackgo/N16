import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EskizService {
  private token: string | null = null;

  private readonly email = process.env.ESKIZ_EMAIL;
  private readonly password = process.env.ESKIZ_PASSWORD;

  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post(
        'https://notify.eskiz.uz/api/auth/login',
        {
          email: this.email,
          password: this.password,
        },
      );

      this.token = response.data.data.token;
    } catch (error) {
      throw new InternalServerErrorException('Eskiz auth failed');
    }
  }

  public async sendSms(phone: string, message: string): Promise<any> {
    if (!this.token) {
      await this.authenticate();
    }

    try {
      const res = await axios.post(
        'https://notify.eskiz.uz/api/message/sms/send',
        {
          mobile_phone: phone,
          message: message,
          from: '4546',
          callback_url: '',
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error(error?.response?.data || error.message);
      throw new InternalServerErrorException('Failed to send SMS');
      return error;
    }
  }

  public async generateOtp(phone: string): Promise<any> {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const message = `Your OTP code is ${otp}`;
    try {
      // const response = await this.sendSms(phone, message);

      return {
        otp,
        //  response
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate OTP');
    }
  }
}
