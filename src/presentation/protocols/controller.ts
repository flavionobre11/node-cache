import { gRPCResponse } from "./grpc";

export default interface Controller<T = any, S = any> {
  handle(request: T): Promise<gRPCResponse<S>>;
}