import RedisConnector from '@/domain/adapters/redis/redis-connector';

describe('Redis Connector', () => {
  it('should connect successfully passing correct configs', () => {
    return expect(new RedisConnector().connect()).resolves.toBeDefined();
  });

  it('should connect error passing wrong configs', () => {
    expect.assertions(1);
    try {
      new RedisConnector({ url: 'localhost:80' });
    } catch (err) {
      return expect(err).toBeInstanceOf(Error);
    }
  });
});
