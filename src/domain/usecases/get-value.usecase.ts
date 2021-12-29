import { CacheDriver } from '../models/cache-drive.model';

export default class GetValue {
  constructor(private readonly cacheDriver: CacheDriver) {}

  async perform(key: string) {
    if (!key) throw new Error('key are required for search an value');
    return await this.cacheDriver.get(key);
  }
}
