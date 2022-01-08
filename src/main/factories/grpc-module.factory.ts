import {
  loadPackageDefinition,
  Server,
  ServiceDefinition,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import { Options, loadSync } from '@grpc/proto-loader';

const DEFAULT_OPTIONS_CONFIG = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }

export default class GRPCModule<T = any> {
  public packageDefinition;
  public proto;

  private services: GRPCModule.GRPCServices[] = []

  constructor(private readonly configs: GRPCModule.Configs) {
    this.packageDefinition = loadSync(
      this.configs.filePath,
      this.configs.pdOptions || DEFAULT_OPTIONS_CONFIG,
    );
    this.proto = loadPackageDefinition(this.packageDefinition) as unknown as T;
  }

  registerService(service: GRPCModule.GRPCServices){
    this.services.push(service)
  }

  loadService(gRPCServer: Server) {
    this.services.forEach((serviceToLoad) =>
      gRPCServer.addService(
        serviceToLoad.service,
        serviceToLoad.implementation,
      ),
    );
  }
}

export namespace GRPCModule {
  export interface Configs {
    filePath: string;
    pdOptions?: Options; // path definition options
  }

  export type GRPCServices = {
    service: ServiceDefinition<UntypedServiceImplementation>;
    implementation: UntypedServiceImplementation;
  };
}
