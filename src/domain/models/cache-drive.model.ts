import { InsertValue } from '../usecases/insert-value.usecase';

export interface CacheDriver {
  set(
    key: string,
    value: string,
    options?: InsertValue.Options,
  ): Promise<InsertValue.Response>;

  get(key: string): Promise<string | null>;
}
