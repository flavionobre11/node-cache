// export default interface GRPCModule {
//     packageDefinition: PackageDefinition;
//     initProtoServices(gRPCServer: Server): void;
//   }

import { ProtoGrpcType } from '@/tests/data/mocks/proto/proto-types/test';
import { loadPackageDefinition } from '@grpc/grpc-js';
import { Options, loadSync } from '@grpc/proto-loader';
import { resolve } from 'path';

interface GRPCModuleConfigs {
  filePath: string;
  pdOptions: Options; // path definition options
}

class GRPCModule<T> {
  public packageDefinition;
  public proto;

  constructor(private readonly configs: GRPCModuleConfigs) {
    this.packageDefinition = loadSync(
      this.configs.filePath,
      this.configs.pdOptions,
    );
    this.proto = loadPackageDefinition(this.packageDefinition) as unknown as T;
  }
}

describe('GRPC Module Factory', () => {
  it('should load proto definitions', async () => {
    const testProtoModule = new GRPCModule<ProtoGrpcType>({
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
