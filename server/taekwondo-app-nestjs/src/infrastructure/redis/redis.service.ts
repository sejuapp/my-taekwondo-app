import { ConfigRedisHelper } from '@common/helpers/config-redis.helper';
import { TimeUtils } from '@common/utils/time.utils';
import { IRedisService } from '@infrastructure/redis/redis.interface';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Servicio para gestionar operaciones con Redis
 * Soporta conexión local con fallback automático a remoto
 */
@Injectable()
export class RedisService
  implements IRedisService, OnModuleInit, OnModuleDestroy
{
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configRedisHelper: ConfigRedisHelper) {
    this.logger.log(`✅ ::::> RedisService iniciado ...`);
  }

  /**
   * Inicializa la conexión a Redis al arrancar el módulo
   * Intenta conectar primero a Redis local, si falla usa el remoto
   */
  async onModuleInit(): Promise<void> {
    const { localUrl, remoteUrl } = this.configRedisHelper.getFullConfig();
    await this.connectWithFallback(localUrl, remoteUrl);
  }

  /**
   * Intenta conectar a Redis con estrategia de fallback
   * @param localUrl - URL de Redis local (opcional)
   * @param remoteUrl - URL de Redis remoto (opcional)
   * @throws Error si no se puede conectar a ningún servidor
   */
  private async connectWithFallback(
    localUrl?: string,
    remoteUrl?: string,
  ): Promise<void> {
    const commonConfig = {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
    };

    // Intentar local primero
    if (localUrl) {
      try {
        this.logger.log('Intentando conexión local...');
        this.client = new Redis(localUrl, {
          ...commonConfig,
          connectTimeout: 3000,
        });
        await this.client.ping();
        this.logger.log('✅ Redis local conectado');
        this.setupEventListeners();
        return;
      } catch {
        this.logger.warn('⚠️  Redis local no disponible');
        this.client?.disconnect();
      }
    }

    // Fallback a remoto
    if (remoteUrl) {
      try {
        this.logger.log('Conectando a Redis remoto...');
        this.client = new Redis(remoteUrl, commonConfig);
        await this.client.ping();
        this.logger.log('✅ Redis remoto conectado');
        this.setupEventListeners();
        return;
      } catch (error) {
        this.logger.error('❌ Redis remoto falló:', error);
        throw new Error('No se pudo conectar a ningún servidor Redis');
      }
    }

    throw new Error('No hay URLs de Redis configuradas');
  }

  /**
   * Configura los listeners de eventos del cliente Redis
   * Monitorea errores y reconexiones
   */
  private setupEventListeners(): void {
    this.client.on('error', (error) => {
      this.logger.error('❌ Error Redis:', error.message);
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('🔄 Reconectando a Redis...');
    });
  }

  // ==================== Operaciones ====================

  /**
   * Guarda un valor en Redis
   * @param key - Clave
   * @param value - Valor
   * @param ttlMinutes - Tiempo de vida en minutos (por defecto el TTL global)
   */
  async set(key: string, value: string, ttlMinutes?: number): Promise<void> {
    const ttl = ttlMinutes ?? this.configRedisHelper.getDefaultTTL();
    await this.client.set(key, value, 'EX', TimeUtils.toSeconds(ttl));
  }

  /**
   * Obtiene un valor de Redis
   * @param key - Clave a buscar
   * @returns El valor asociado o null si no existe
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * Elimina una clave de Redis
   * @param key - Clave a eliminar
   * @returns Número de claves eliminadas (0 o 1)
   */
  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  // ==================== Operaciones con objetos ====================

  /**
   * Guarda un objeto en Redis como JSON
   * @param key - Clave
   * @param value - Objeto a guardar
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
   * Obtiene un objeto de Redis y lo parsea desde JSON
   * @param key - Clave a buscar
   * @returns El objeto parseado o null si no existe
   */
  async getObject<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  // ==================== Utilidades ====================

  /**
   * Obtiene el cliente Redis directo para operaciones avanzadas
   * @returns Instancia del cliente Redis
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Cierra la conexión con Redis al destruir el módulo
   */
  onModuleDestroy(): void {
    this.client?.disconnect();
    this.logger.log('👋 Redis desconectado');
  }
}
