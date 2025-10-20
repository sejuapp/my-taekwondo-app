import { REDIS_CONSTANTS } from '@common/constants/redis.constants';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Helper inyectable para configuración de Redis
 * Se puede inyectar en servicios y mantiene referencia al ConfigService
 */
@Injectable()
export class ConfigRedisHelper {
  constructor(private configService: ConfigService) {}

  /**
   * TTL por defecto en minutos
   * Lee de la variable de entorno REDIS_TTL_MINUTES
   * Si no está definida, usa el valor de las constantes
   * @returns Tiempo de vida en minutos
   */
  getDefaultTTL(): number {
    const value = this.configService.get<string>('REDIS_TTL_MINUTES');
    return Number(value) || REDIS_CONSTANTS.DEFAULT_TTL_MINUTES;
  }

  /**
   * Obtiene la URL de Redis local
   * @returns URL o undefined
   */
  getLocalUrl(): string | undefined {
    return this.configService.get('REDIS_URL_LOCAL');
  }

  /**
   * Obtiene la URL de Redis remoto
   * @returns URL o undefined
   */
  getRemoteUrl(): string | undefined {
    return this.configService.get('REDIS_URL');
  }

  /**
   * Obtiene la configuración completa de Redis
   * @returns Objeto con toda la configuración
   */
  getFullConfig() {
    return {
      localUrl: this.getLocalUrl(),
      remoteUrl: this.getRemoteUrl(),
      defaultTTL: this.getDefaultTTL(),
    };
  }
}
