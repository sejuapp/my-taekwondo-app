import { Injectable, BadRequestException } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@infrastructure/redis/redis.service';
import { ConfigRedisHelper } from '@common/helpers/config-redis.helper';
import { REDIS_CONSTANTS } from '@common/constants/redis.constants';

@Injectable()
export class AuthService {
  private transporter: Transporter;

  constructor(
    private redisService: RedisService,
    private configRedisHelper: ConfigRedisHelper,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendCode(email: string): Promise<{ message: string }> {
    const key = `${REDIS_CONSTANTS.KEY_PREFIXES.VERIFICATION}:${email}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const min = this.configRedisHelper.getDefaultTTL();

    await this.redisService.set(key, code);

    await this.transporter.sendMail({
      from: `"Taekwondo App" <${this.configService.get('MAIL_USER')}>`,
      to: email,
      subject: 'Código de acceso',
      text: `Tu código de verificación es: ${code}. Expira en ${min} minutos.`,
    });

    return { message: 'Código enviado al correo.' };
  }

  async verifyCode(
    email: string,
    code: string,
  ): Promise<{ success: boolean; email: string }> {
    const key = `${REDIS_CONSTANTS.KEY_PREFIXES.VERIFICATION}:${email}`;
    const storedCode = await this.redisService.get(key);

    if (!storedCode) {
      throw new BadRequestException('Código expirado o inválido');
    }

    if (storedCode !== code) {
      throw new BadRequestException('Código incorrecto');
    }

    await this.redisService.del(key);

    return { success: true, email };
  }
}
