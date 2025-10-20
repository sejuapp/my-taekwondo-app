export interface IRedisService {
  set(key: string, value: string, ttlMinutes?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;

  setObject<T>(key: string, value: T, ttlMinutes?: number): Promise<void>;
  getObject<T>(key: string): Promise<T | null>;
}
