import { CacheDriver } from '@/domain/models/cache-drive.model';
import { RedisClient } from './redis.adapter';
import SetCommand, { RedisDriverSetOptions } from './usecases/set.usecase';

export default class RedisDriver implements CacheDriver {
  constructor(private readonly redisClient: RedisClient) {}

  async set(key: string, value: string, options?: RedisDriverSetOptions) {
    return await SetCommand.perform(this.redisClient, key, value, options);
  }
}
