// export default interface GRPCModule {
//     packageDefinition: PackageDefinition;
//     initProtoServices(gRPCServer: Server): void;
//   }

import { loadPackageDefinition } from '@grpc/grpc-js';
import { Options, loadSync } from '@grpc/proto-loader';
import { resolve } from 'path';

interface GRPCModuleConfigs {
  filePath: string;
  pdOptions: Options; // path definition options
}

class GRPCModule {
  public packageDefinition;
  public proto;

  constructor(private readonly configs: GRPCModuleConfigs) {
    this.packageDefinition = loadSync(configs.filePath, configs.pdOptions);
    this.proto = loadPackageDefinition(this.packageDefinition);
  }
}

describe('GRPC Module Factory', () => {
  it('should load proto definitions', async () => {
    const testProtoModule = new GRPCModule({
      filePath: resolve(
        __dirname,
        '..',
        '..',
        '..',
        'data',
        'mocks',
        'proto',
        'test.proto',
      ),
      pdOptions: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    });

    console.log(testProtoModule.proto);
    expect(testProtoModule.proto).toBeDefined();
  });
});
