import { RedisModule } from '@infrastructure/redis/redis.module';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigRedisHelper } from 'src/common/helpers/config-redis.helper';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [AuthService, ConfigRedisHelper],
  controllers: [AuthController],
})
export class AuthModule {}
