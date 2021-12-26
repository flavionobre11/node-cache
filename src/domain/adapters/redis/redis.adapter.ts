import { createClient, RedisClientOptions } from "@/infra/cache"

export interface RedisConnectorConfigs extends Omit<RedisClientOptions<never, Record<string, never>>, "modules"> {}

export default class RedisConnector {
  
  static async connect(configs?: RedisConnectorConfigs){
    const client = createClient(configs)
    await client.connect().catch(error => {
      throw new Error('redis connection error')
    })
    return client
  }
}