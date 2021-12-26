import { createClient, RedisClientOptions } from "@/infra/cache"

export interface RedisConnectorConfigs extends Omit<RedisClientOptions<never, Record<string, never>>, "modules"> {}

export type RedisClient = ReturnType<typeof createClient>

export default class RedisConnector {

  private _client!: RedisClient
  
  constructor(configs?: RedisConnectorConfigs){
    this._client = createClient(configs) as RedisClient
  }
  
  async connect(){
    await this._client.connect().catch(error => {
      throw new Error('redis connection error')
    })
    return this._client
  }
}