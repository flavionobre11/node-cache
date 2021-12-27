import RedisDriver from '@/domain/adapters/redis/redis-driver';
import { RedisClient } from '@/domain/adapters/redis/redis.adapter';
import InsertValue from '@/domain/usecases/insert-value.usecase';

const RedisClientMock = {
  set: jest.fn().mockImplementation((key, value, options?) => {
    return key && value ? 'OK' : null;
  }),
} as Pick<RedisClient, 'set'>;

const makeSut = () => {
  const redisDriver = new RedisDriver(RedisClientMock as RedisClient);
  const sut = new InsertValue(redisDriver);
  return {
    sut,
  };
};

describe('InsertValue Usecase', () => {
  it('should be insert an key-value registry', async () => {
    const key = 'any_key';
    const value = 'any_value';
    const { sut } = makeSut();

    const resultPromise = sut.perform(key, value);
    await expect(resultPromise).resolves.toMatchObject({
      key: key,
      value: value,
    });
  });

  it('should be possible insert a value with deadline in milliseconds', async () => {
    const key = 'any_key:expires:30seconds';
    const value = 'any_value';
    const expiresIn = 30 * 1000;
    const { sut } = makeSut();
    const result = await sut.perform(key, value, { exp: expiresIn });
    expect(result).toHaveProperty('expires');
    expect(typeof result.expires).toBe('string');
  });

  it('should be possible insert a value with deadline on date format', async () => {
    const key = 'any_key:expires:1day';
    const value = 'any_value';
    const expiresIn = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const { sut } = makeSut();
    const result = await sut.perform(key, value, {
      exp: expiresIn,
    });
    expect(result).toHaveProperty('expires');
    expect(typeof result.expires).toBe('string');
    expect(result.expires).toBe(expiresIn.toISOString());
  });

  it('should thrown excpetion if was a null key', async () => {
    const { sut } = makeSut();
    const resultPromise = sut.perform('', 'any_value');
    await expect(resultPromise).rejects.toThrowError(
      'key should be string and not null',
    );
  });

  it('should thrown excpetion if was a null value', async () => {
    const { sut } = makeSut();
    const resultPromise = sut.perform('any_key:without_value', '');
    await expect(resultPromise).rejects.toThrowError(
      'value should be string and not null',
    );
  });
});
