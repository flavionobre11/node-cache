import { CacheDriver } from '@/domain/models/cache-drive.model';
import { RedisClient } from './redis.adapter';

export default class RedisDriver implements CacheDriver {
  constructor(private readonly redisClient: RedisClient) {}

  async set(key: string, value: string, options?: { exp: number | Date }) {
    const opt = {};
    let expires = undefined;

    if (typeof options?.exp === 'number') {
      Reflect.set(opt, 'PX', options?.exp); // milli unix
      expires = new Date(Date.now() + options?.exp).toISOString();
    } else if (options?.exp instanceof Date) {
      Reflect.set(
        opt,
        'EXAT',
        Number((options?.exp.getTime() / 1000).toFixed(0)),
      ); // date to unix
      expires = new Date(options?.exp).toISOString();
    }

    const result = await this.redisClient.set(key, value, opt);
    if (!result) throw new Error('value not set');

    return {
      key,
      value,
      expires,
    };
  }
}
