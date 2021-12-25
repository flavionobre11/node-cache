import { createClient, RedisClientOptions } from 'redis'

class RedisConnector {
  
  static async connect(configs?: RedisConnectorConfigs){
    const client = createClient(configs)
    await client.connect().catch(error => {
      throw new Error('redis connection error')
    })
    return client
  }
}


interface RedisConnectorConfigs extends Omit<RedisClientOptions<never, Record<string, never>>, "modules"> {}


describe("Redis Connector", () => {

  it('should connect successfully passing correct configs', async () => {
    return expect(RedisConnector.connect()).resolves.toBeDefined()
  })

  it('should connect error passing wrong configs', async () => {
    return expect(RedisConnector.connect({url: 'localhost:80'})).rejects.toThrowError()
  })
})