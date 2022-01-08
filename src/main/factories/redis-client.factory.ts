import RedisConnector, { RedisClient } from "@/domain/adapters/redis/redis-connector";

export default class RedisClientFactory {
  private static client = null as unknown as RedisClient;
  static async getClient(){
    if(RedisClientFactory.client) return RedisClientFactory.client 
    const redisClient = await new RedisConnector().connect()
    RedisClientFactory.client = redisClient
    return RedisClientFactory.client
  }
}