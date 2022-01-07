import { ProtoGrpcType } from "@/infra/proto/proto-types/insert-register";
import GRPCModule from "@/main/factories/grpc-module.factory";
import { Server } from "@grpc/grpc-js";
import { resolve } from 'path'

const insertRegisterModule = new GRPCModule<ProtoGrpcType>(new Server(), {
  filePath: resolve(__dirname, '..', '..', '..', '..', 'infra', 'proto', 'insert-register.proto')
})

insertRegisterModule.
