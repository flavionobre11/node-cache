import RedisDriver from '@/domain/adapters/redis/redis-driver';
import InsertValueCache from '@/domain/usecases/insert-value.usecase';
import { InsertRegisterController } from '@/presentation/controllers/insert-register.controller';
import MissingPropertiesValidator from '@/validation/validators/missing-properties.validator';
import RedisClientFactory from './redis-client.factory';

export const insertRegisterControllerFactory = async () => {
  const redisClient = await RedisClientFactory.getClient();
  const redisDriver = new RedisDriver(redisClient);
  const insertValueCache = new InsertValueCache(redisDriver);
  return new InsertRegisterController(
    insertValueCache,
    new MissingPropertiesValidator(),
  );
}
