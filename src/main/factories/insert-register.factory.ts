import RedisDriver from '@/domain/adapters/redis/redis-driver';
import InsertValueCache from '@/domain/usecases/insert-value.usecase';
import { Options } from '@/infra/proto/proto-types/InsertRegisterPackage/Options';
import { SaveRegisterRequest } from '@/infra/proto/proto-types/InsertRegisterPackage/SaveRegisterRequest';
import { SaveRegisterResponse } from '@/infra/proto/proto-types/InsertRegisterPackage/SaveRegisterResponse';
import { InsertRegisterController } from '@/presentation/controllers/insert-register.controller';
import MissingPropertiesValidator from '@/validation/validators/missing-properties.validator';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import RedisClientFactory from './redis-client.factory';

export const insertRegisterGRPCFactory = async (
  call: ServerUnaryCall<SaveRegisterRequest, SaveRegisterResponse>,
  response: sendUnaryData<SaveRegisterResponse>,
) => {
  const redisClient = await RedisClientFactory.getClient();
  const redisDriver = new RedisDriver(redisClient);
  const insertValueCache = new InsertValueCache(redisDriver);
  const insertRegisterController = new InsertRegisterController(
    insertValueCache,
    new MissingPropertiesValidator(),
  );
  const { key, value, options } = call.request
  const request = {key, value, options} as InsertRegisterController.Request
  if(request.options?.exp){
    const exp = request.options.exp
    request.options.exp = isNaN(Number(exp)) ? new Date(exp) : Number(exp) 
  };

  insertRegisterController.handle(request)
    .then(result => response(null, {statusCode: result.statusCode, data: JSON.stringify(result.data)}))
    .catch((err) => response(err))
};
