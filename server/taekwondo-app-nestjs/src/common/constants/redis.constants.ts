/**
 * Constantes de configuración para Redis
 */
export const REDIS_CONSTANTS = {
  /**
   * Tiempo de vida por defecto para claves en Redis (en minutos)
   * @default 5 minutos
   */
  DEFAULT_TTL_MINUTES: 15,

  /**
   * Prefijos para diferentes tipos de claves
   */
  KEY_PREFIXES: {
    VERIFICATION: 'verify',
    SESSION: 'session',
    RESET_PASSWORD: 'reset',
    CACHE: 'cache',
  },
} as const;
