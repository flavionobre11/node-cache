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
  validate(input: any): Error | void | Promise<Error | void>;
}

class MissingPropertiesValidator implements Validation {
  validate(props: {[key: string]: any}): Error | void {
    if (!props) return new Error('');
    const foundInvalid = Object.keys(props).find(key => !props[key])
    if(foundInvalid) return new Error(`property ${foundInvalid} is required`)
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
      const error = this.validation.validate({key, value}) as Error
      if(error){
        return {
          statusCode: 400,
          data: {
            message: error.message
          }
        }
      }
      
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
    expect(result).toMatchObject<Response>({
      statusCode: 400,
      data: {
        message: 'property key is required' 
      }
    })
  });

  it('should return 400 if value is bad value', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({key: 'any_key', value: ''});
    expect(result).toMatchObject<Response>({
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
    expect(result).toMatchObject<Response>({
      statusCode: 201,
      data: {
        key,
        value
      } as InsertValue.Response
    })
  });
});
