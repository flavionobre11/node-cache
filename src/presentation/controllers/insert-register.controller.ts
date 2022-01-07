import { InsertValue } from "@/domain/usecases/insert-value.usecase";
import Controller from "../protocols/controller";
import Validation from "../protocols/validation";

export class InsertRegisterController implements Controller {
  constructor(
    private readonly insertValue: InsertValue,
    private readonly validation: Validation,
  ) {}
  async handle(request: InsertRegisterController.Request) {
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