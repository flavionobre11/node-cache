import { RedisClient } from '../redis-connector';

export default class GetCommand {
  static async perform(redisClient: RedisClient, key: string) {
    if (!redisClient) throw new Error('redisClient is required');
    if (!key) throw new Error('key are required');
    return await redisClient.get(key);
  }
}
