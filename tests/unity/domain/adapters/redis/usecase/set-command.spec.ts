import { RedisClient } from '@/domain/adapters/redis/redis-connector';
import SetCommand from '@/domain/adapters/redis/usecases/set.usecase';
import { DriverSetResponse } from '@/domain/models/cache-drive.model';

const RedisClientMock = {
  set: jest.fn().mockImplementation((key, value, options?) => {
    return key && value ? 'OK' : null;
  }),
} as Pick<RedisClient, 'set'> as RedisClient;

describe('SetCommand Usecase', () => {
  it('should be possible set an registry and return key and value', async () => {
    const key = 'any_key:test';
    const value = 'any_value';
    const resultPromise = SetCommand.perform(RedisClientMock, key, value);
    await expect(resultPromise).resolves.toMatchObject<DriverSetResponse>({
      key: key,
      value: value,
    });
  });

  it('should be possible set an registry with TTL in milli and return key, value and expires in ISOString', async () => {
    const key = 'any_key:expires:30seconds';
    const value = 'any_value';
    const expiresIn = 30 * 1000;
    const resultPromise = SetCommand.perform(RedisClientMock, key, value, {
      exp: expiresIn,
    });
    await expect(resultPromise).resolves.toMatchObject<
      Required<DriverSetResponse>
    >({
      key: key,
      value: value,
      expires: new Date(Date.now() + expiresIn).toISOString(),
    });
  });
});
