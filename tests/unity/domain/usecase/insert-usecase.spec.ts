import { RedisClient } from '@/domain/adapters/redis/redis.adapter';

class InsertValue {
  constructor(private readonly redisDriver: RedisDriver) {}

  async perform(key: string, value: string) {
    return await this.redisDriver.set(key, value);
  }
}

class RedisDriverMock implements RedisDriver {
  constructor(private readonly redisClient: RedisClient) {}

  async set(key: string, value: string) {
    const result = await this.redisClient.set(key, value);
    if (!result) throw new Error('value not set');
    return {
      key,
      value,
    };
  }
}

const RedisClientMock = {
  set: jest
    .fn()
    .mockImplementation((key, value) => (key && value ? 'OK' : null)),
} as Pick<RedisClient, 'set'>;

type RedisDriveSetResponse = {
  key: string;
  value: string;
};

interface RedisDriver {
  set(key: string, value: string): Promise<RedisDriveSetResponse>;
}

describe('InsertValue Usecase', () => {
  it('should be insert an key-value registry', async () => {
    const key = 'any_key';
    const value = 'any_value';
    const redisDriver = new RedisDriverMock(RedisClientMock as RedisClient);
    const sut = new InsertValue(redisDriver);

    const resultPromise = sut.perform(key, value);
    await expect(resultPromise).resolves.toMatchObject({
      key: key,
      value: value,
    });
  });
});
