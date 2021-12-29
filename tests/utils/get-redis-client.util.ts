import RedisConnector, {
  RedisClient,
} from '@/domain/adapters/redis/redis-connector';

let _redisClient = null as unknown as RedisClient;

export const RedisCliente2eTest = async () => {
  if (_redisClient) return _redisClient;
  return await new RedisConnector().connect();
};
