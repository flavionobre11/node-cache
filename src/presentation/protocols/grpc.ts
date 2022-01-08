export type gRPCResponse<T = any> = {
  statusCode: number;
  data?: T;
};