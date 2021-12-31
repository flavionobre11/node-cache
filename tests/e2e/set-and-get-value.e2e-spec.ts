import RedisDriver from '@/domain/adapters/redis/redis-driver';
import { DriverSetResponse } from '@/domain/models/cache-drive.model';
import GetValue from '@/domain/usecases/get-value.usecase';
import InsertValueCache from '@/domain/usecases/insert-value.usecase';
import { RedisCliente2eTest } from '../utils/get-redis-client.util';
import { sleep } from '../utils/sleep.util';

const makeSut = async () => {
  const redisDriver = new RedisDriver(await RedisCliente2eTest());
  const insertValue = new InsertValueCache(redisDriver);
  const getValue = new GetValue(redisDriver);
  return {
    insertValue,
    getValue,
  };
};

describe('Set and Get value on cache', () => {
  const key = 'key:e2e-test:01',
    value = 'any_value_e2e';

  it('should insert an registry on cache', async () => {
    const { insertValue } = await makeSut();
    const result = insertValue.perform(key, value);
    await expect(result).resolves.toMatchObject<DriverSetResponse>({
      key: key,
      value: value,
    });
  });

  it('should get an value on cache', async () => {
    const { getValue } = await makeSut();
    const key = 'key:e2e-test:01';
    const result = getValue.perform(key);
    await expect(result).resolves.toMatch(value);
  });

  it('shoud insert an value with deadline', async () => {
    const { insertValue, getValue } = await makeSut();
    const toTest = {
      key: 'key:e2e-test:deadline',
      value: 'deadline in 2 seconds',
      expires: 2 * 1000,
    };
    const insertResult = await insertValue.perform(toTest.key, toTest.value, {
      exp: toTest.expires,
    });
    expect(insertResult).toHaveProperty('expires');
    expect(typeof insertResult.expires).toBe('string');

    await sleep(toTest.expires + 500);

    const getResult = getValue.perform(toTest.key);
    await expect(getResult).resolves.toBeNull();
  });
});
