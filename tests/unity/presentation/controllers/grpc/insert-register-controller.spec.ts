import { InsertValue } from '@/domain/usecases/insert-value.usecase';
import { InsertRegisterController } from '@/presentation/controllers/insert-register.controller';
import { gRPCResponse } from '@/presentation/protocols/grpc';
import { throwError } from '@/tests/utils/common.util';
import MissingPropertiesValidator from '@/validation/validators/missing-properties.validator';

class InsertValueCacheSpy implements InsertValue {
  async perform(
    key: string,
    value: string,
    options?: InsertValue.Options,
  ): Promise<InsertValue.Response> {
    return {
      key,
      value,
    };
  }
}

const makeSut = () => {
  const insertValueCache = new InsertValueCacheSpy();
  const insertRegisterController = new InsertRegisterController(
    insertValueCache,
    new MissingPropertiesValidator()
  );
  return {
    insertValueCache,
    sut: insertRegisterController,
  };
};

const mockRequest = {
  key: 'any_key:controller:test',
  value: 'any_value',
} as InsertRegisterController.Request;

describe('Insert Register Controller', () => {
  it('should return 500 if insert throws', async () => {
    const { insertValueCache, sut } = makeSut();
    jest.spyOn(insertValueCache, 'perform').mockImplementationOnce(throwError);
    const result = await sut.handle(mockRequest);
    expect(result.statusCode).toBe(500);
  });

  it('should return 400 if key is bad value', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({key: '', value: 'any_value'});
    expect(result).toMatchObject<gRPCResponse>({
      statusCode: 400,
      data: {
        message: 'property key is required' 
      }
    })
  });

  it('should return 400 if value is bad value', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({key: 'any_key', value: ''});
    expect(result).toMatchObject<gRPCResponse>({
      statusCode: 400,
      data: {
        message: 'property value is required' 
      }
    })
  });

  it('should return 201 if register successfully', async () => {
    const { sut } = makeSut();
    const { value, key } = mockRequest
    const result = await sut.handle({ value, key });
    expect(result).toMatchObject<gRPCResponse>({
      statusCode: 201,
      data: {
        key,
        value
      } as InsertValue.Response
    })
  });
});
