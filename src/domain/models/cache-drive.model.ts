export interface CacheDriver {
  set(
    key: string,
    value: string,
    options?: { exp: number | Date },
  ): Promise<DriverSetResponse>;
}

export type DriverSetResponse = {
  key: string;
  value: string;
  expires?: string;
};
