import GRPCModule from '@/main/factories/grpc-module.factory';
import { ProtoGrpcType } from '@/tests/data/mocks/proto/proto-types/test';
import { Server } from '@grpc/grpc-js';
import { resolve } from 'path';

const makeSut = () => {
  const gRPCServer = new Server();
  const testProtoModule = new GRPCModule<ProtoGrpcType>(gRPCServer, {
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
    console.log(sut.proto);
    expect(sut.proto).toBeDefined();
  });
});
