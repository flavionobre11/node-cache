import { RedisClient } from '@/domain/adapters/redis/redis.adapter';

class InsertValue {
  constructor(private readonly redisDriver: RedisDriver) {}

  async perform(key: string, value: string, options?: { exp: number | Date }) {
    if (!key || typeof key !== 'string')
      throw new Error('key should be string and not null');
    // if (!value || typeof value !== 'string')
    //   throw new Error('key should be string and not null');
    return await this.redisDriver.set(key, value, options);
  }
}

class RedisDriverMock implements RedisDriver {
  constructor(private readonly redisClient: RedisClient) {}

  async set(key: string, value: string, options?: { exp: number | Date }) {
    const opt = {};
    let expires = undefined;

    if (typeof options?.exp === 'number') {
      Reflect.set(opt, 'PX', options?.exp); // milli unix
      expires = new Date(Date.now() + options?.exp).toISOString();
    } else if (options?.exp instanceof Date) {
      Reflect.set(
        opt,
        'EXAT',
        Number((options?.exp.getTime() / 1000).toFixed(0)),
      ); // date to unix
      expires = new Date(options?.exp).toISOString();
    }

    const result = await this.redisClient.set(key, value, opt);
    if (!result) throw new Error('value not set');

    return {
      key,
      value,
      expires,
    };
  }
}

const RedisClientMock = {
  set: jest.fn().mockImplementation((key, value, options?) => {
    return key && value ? 'OK' : null;
  }),
} as Pick<RedisClient, 'set'>;

type RedisDriveSetResponse = {
  key: string;
  value: string;
  expires?: string;
};

interface RedisDriver {
  set(
    key: string,
    value: string,
    options?: { exp: number | Date },
  ): Promise<RedisDriveSetResponse>;
}

const makeSut = () => {
  const redisDriver = new RedisDriverMock(RedisClientMock as RedisClient);
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
});
