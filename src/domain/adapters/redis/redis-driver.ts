import { CacheDriver } from '@/domain/models/cache-drive.model';
import { RedisClient } from './redis-connector';
import GetCommand from './usecases/get.usecase';
import SetCommand, { RedisSetCommandOptions } from './usecases/set.usecase';

export default class RedisDriver implements CacheDriver {
  constructor(private readonly redisClient: RedisClient) {}

  async set(key: string, value: string, options?: RedisSetCommandOptions) {
    return SetCommand.perform(this.redisClient, key, value, options);
  }

  async get(key: string) {
    return GetCommand.perform(this.redisClient, key);
  }
}
