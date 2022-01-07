import GRPCModule from '@/main/factories/grpc-module.factory';
import { ProtoGrpcType } from '@/tests/data/mocks/proto/proto-types/test';
import { resolve } from 'path';

const makeSut = () => {
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
  });
  return { sut: testProtoModule };
};

describe('GRPC Module Factory', () => {
  it('should load proto definitions', () => {
    const { sut } = makeSut();
    expect(sut.proto).toBeDefined();
  });
});
