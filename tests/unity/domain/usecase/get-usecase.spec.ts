import { RedisClient } from '@/domain/adapters/redis/redis-connector';
import RedisDriver from '@/domain/adapters/redis/redis-driver';
import GetValue from '@/domain/usecases/get-value.usecase';

const VALUES: { [key: string]: string } = {};

const RedisClientMock = {
  set: jest.fn().mockImplementation((key, value, options?) => {
    Reflect.set(VALUES, key, value);
    return 'OK';
  }),
  get: jest.fn().mockImplementation(async (key) => {
    return await Reflect.get(VALUES, key);
  }),
} as Pick<RedisClient, 'get' | 'set'> as RedisClient;

const makeSut = () => {
  const redisDriver = new RedisDriver(RedisClientMock as RedisClient);
  const sut = new GetValue(redisDriver);
  return {
    sut,
  };
};

describe('GetValue Usecase', () => {
  it('should return the value related to the key passed as parameter', async () => {
    const key = 'any_key:test';
    const value = 'any_value';
    RedisClientMock.set(key, value);
    const { sut } = makeSut();
    const resultPromise = sut.perform(key);
    await expect(resultPromise).resolves.toMatch(value);
  });

  it('should thrown excpetion if key is null', async () => {
    const { sut } = makeSut();
    const resultPromise = sut.perform('');
    await expect(resultPromise).rejects.toThrowError(
      'key are required for search an value',
    );
  });
});
