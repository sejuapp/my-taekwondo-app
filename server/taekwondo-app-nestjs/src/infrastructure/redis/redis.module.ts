import { ConfigRedisHelper } from '@common/helpers/config-redis.helper';
import { RedisFakeService } from '@infrastructure/redis/redis-fake.service';
import { RedisService } from '@infrastructure/redis/redis.service';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const redisProvider: Provider = {
  provide: RedisService,
  useFactory: (
    configService: ConfigService,
    configRedisHelper: ConfigRedisHelper,
  ) => {
    const useFake = configService.get('NODE_ENV') !== 'production';
    return useFake
      ? new RedisFakeService(configRedisHelper)
      : new RedisService(configRedisHelper);
  },
  inject: [ConfigService, ConfigRedisHelper],
};

@Module({
  imports: [ConfigModule],
  providers: [redisProvider, ConfigRedisHelper],
  exports: [redisProvider],
})
export class RedisModule {}
