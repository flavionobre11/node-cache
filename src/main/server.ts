import GrpcApp from './config/grpc';
import InsertRegisterModule from './config/grpc/modules/insert-register.module';


async function bootstrap () {
  const app = new GrpcApp({
    host: process.env.GRPC_HOST as string,
    modules: [new InsertRegisterModule()]
  })
  await app.listen()
}

bootstrap()
