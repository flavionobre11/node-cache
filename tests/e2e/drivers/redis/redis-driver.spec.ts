import RedisConnector from "@/domain/adapters/redis/redis.adapter"

describe("Redis Connector", () => {

  it('should connect successfully passing correct configs', async () => {
    return expect(RedisConnector.connect()).resolves.toBeDefined()
  })

  it('should connect error passing wrong configs', async () => {
    return expect(RedisConnector.connect({url: 'localhost:80'})).rejects.toThrowError()
  })
})