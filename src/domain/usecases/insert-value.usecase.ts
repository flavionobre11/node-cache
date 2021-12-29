import { CacheDriver } from '../models/cache-drive.model';

export default class InsertValue {
  constructor(private readonly cacheDriver: CacheDriver) {}

  async perform(key: string, value: string, options?: { exp: number | Date }) {
    if (!key || typeof key !== 'string')
      throw new Error('key should be string and not null');
    if (!value || typeof value !== 'string')
      throw new Error('value should be string and not null');
    return await this.cacheDriver.set(key, value, options);
  }
}
