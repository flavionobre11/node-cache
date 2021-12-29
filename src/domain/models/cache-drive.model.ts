export interface CacheDriver {
  set(
    key: string,
    value: string,
    options?: { exp: number | Date },
  ): Promise<DriverSetResponse>;

  get(key: string): Promise<string | null>;
}

export type DriverSetResponse = {
  key: string;
  value: string;
  expires?: string;
};
