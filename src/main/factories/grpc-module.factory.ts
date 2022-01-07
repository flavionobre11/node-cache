import {
  loadPackageDefinition,
  Server,
  ServiceDefinition,
  UntypedServiceImplementation,
} from '@grpc/grpc-js';
import { Options, loadSync } from '@grpc/proto-loader';

const DEFAULT_MODULE_CONFIGS = {
  filePath: '',
  pdOptions: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
} as GRPCModuleConfigs;

export interface GRPCModuleConfigs {
  filePath: string;
  pdOptions?: Options; // path definition options
}

export default class GRPCModule<T = any> {
  public packageDefinition;
  public proto;

  constructor(
    private readonly configs: GRPCModuleConfigs = DEFAULT_MODULE_CONFIGS,
  ) {
    this.packageDefinition = loadSync(
      this.configs.filePath,
      this.configs.pdOptions,
    );
    this.proto = loadPackageDefinition(this.packageDefinition) as unknown as T;
  }

  loadService(
    gRPCServer: Server,
    service: ServiceDefinition<UntypedServiceImplementation>,
    implementation: UntypedServiceImplementation,
  ) {
    gRPCServer.addService(service, implementation);
  }
}
