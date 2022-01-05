import { InsertValue } from '@/domain/usecases/insert-value.usecase';
import { throwError } from '@/tests/utils/common.util';

class InsertValueCacheSpy implements InsertValue {
  async perform(
    key: string,
    value: string,
    options?: InsertValue.Options,
  ): Promise<InsertValue.Response> {
    return {
      key,
      value,
      expires: new Date(Date.now() + (options?.exp as number)).toISOString(),
    };
  }
}

interface Controller<T = any, S = any> {
  handle(request: T): Promise<Response<S>>;
}

type Response<T = any> = {
  statusCode: number;
  data?: T;
};

interface Validation {
  validate(input: any): Error;
}

class MissingPropertiesValidator implements Validation {
  error: Error = null;
  validate(prop: any) {
    if (!prop) return new Error('');
    return null as unknown as Error;
  }
}

class InsertRegisterController implements Controller {
  constructor(
    private readonly insertValue: InsertValue,
    private readonly validation: Validation,
  ) {}
  async handle(request: InsertRegisterController.Request): Promise<Response> {
    try {
      const { key, value, options } = request;
      if (!key || !value)
        return {
          statusCode: 400,
          data: { message: 'key and value is required' },
        };
      const result = await this.insertValue.perform(key, value, options);
      return {
        statusCode: 201,
        data: result,
      };
    } catch (err) {
      return {
        statusCode: 500,
        data: {
          message: 'Error on insert register',
        },
      };
    }
  }
}

export namespace InsertRegisterController {
  export type Request = {
    key: string;
    value: string;
    options?: InsertValue.Options;
  };
}

const makeSut = () => {
  const insertValueCache = new InsertValueCacheSpy();
  const insertRegisterController = new InsertRegisterController(
    insertValueCache,
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
    console.log(result);
  });

  it('should return 500 if insert throws', async () => {
    const { sut } = makeSut();
    const result = await sut.handle(jest.mock);
    expect(result.statusCode).toBe(500);
    console.log(result);
  });
});
