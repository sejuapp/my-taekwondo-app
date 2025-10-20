import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

import { IRedisService } from '@infrastructure/redis/redis.interface';
import { ConfigRedisHelper } from '@common/helpers/config-redis.helper';
import { TimeUtils } from '@common/utils/time.utils';

/**
 * Servicio falso que emula Redis usando un Map en memoria.
 *
 * 💡 Ideal para entornos locales o de desarrollo cuando no hay Redis real.
 *
 * Cumple con la interfaz `IRedisService` y mantiene el mismo comportamiento:
 * - TTL configurable vía `REDIS_TTL_MINUTES`
 * - Métodos asíncronos
 * - Serialización JSON para objetos
 */
@Injectable()
export class RedisFakeService implements IRedisService, OnModuleDestroy {
  private readonly logger = new Logger(RedisFakeService.name);

  /** Almacén interno que simula Redis */
  private store = new Map<string, { value: string; expires: number }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private configRedisHelper: ConfigRedisHelper) {
    this.logger.log(`✅ ::::> RedisFakeService iniciado ...`);

    const time = TimeUtils.toMilliseconds(15);

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, time);
  }

  /**
   * Guarda un valor en memoria con un TTL simulado.
   * @param key - Clave a guardar
   * @param value - Valor en formato string
   * @param ttlMinutes - Tiempo de vida en minutos (por defecto el TTL global)
   */
  async set(key: string, value: string, ttlMinutes?: number): Promise<void> {
    await this.simulateDelay();
    const ttl = ttlMinutes ?? this.configRedisHelper.getDefaultTTL();
    const expires = Date.now() + TimeUtils.toMilliseconds(ttl);
    this.store.set(key, { value, expires });
  }

  /**
   * Obtiene un valor del almacenamiento en memoria.
   * Si el valor expiró, se elimina automáticamente.
   * @param key - Clave a consultar
   * @returns Valor asociado o `null` si no existe o expiró
   */
  async get(key: string): Promise<string | null> {
    await this.simulateDelay();
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Elimina una clave del almacenamiento en memoria.
   * @param key - Clave a eliminar
   * @returns 1 si se eliminó, 0 si no existía
   */
  async del(key: string): Promise<number> {
    await this.simulateDelay();
    const deleted = this.store.delete(key);
    return deleted ? 1 : 0;
  }

  /**
   * Guarda un objeto serializado como JSON.
   * @param key - Clave a guardar
   * @param value - Objeto a serializar
   * @param ttlMinutes - Tiempo de vida en minutos (por defecto el TTL global)
   */
  async setObject<T>(
    key: string,
    value: T,
    ttlMinutes?: number,
  ): Promise<void> {
    const ttl = ttlMinutes ?? this.configRedisHelper.getDefaultTTL();
    await this.set(key, JSON.stringify(value), ttl);
  }

  /**
   * Obtiene y deserializa un objeto JSON almacenado.
   * @param key - Clave a buscar
   * @returns Objeto parseado o `null` si no existe o expiró
   */
  async getObject<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Simula un pequeño retardo para mantener la interfaz asíncrona.
   */
  private async simulateDelay(): Promise<void> {
    return Promise.resolve();
  }

  /** Limpieza periódica de items expirados*/
  private cleanup(): void {
    const now = Date.now();
    let deleted = 0;

    for (const [key, item] of this.store.entries()) {
      if (now > item.expires) {
        this.store.delete(key);
        deleted++;
      }
    }

    this.logger.log(`🧹 Limpieza: ${deleted} claves expiradas eliminadas`);
  }

  /**
   * Hook del ciclo de vida de NestJS que se ejecuta al destruir el módulo.
   * Limpia el intervalo de limpieza automática para prevenir memory leaks
   * y evitar que el timer siga ejecutándose después de destruir el servicio.
   */
  onModuleDestroy(): void {
    clearInterval(this.cleanupInterval);
  }
}
