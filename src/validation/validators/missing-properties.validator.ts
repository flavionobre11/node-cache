import Validation from "@/presentation/protocols/validation";

export default class MissingPropertiesValidator implements Validation {
  validate(props: {[key: string]: any}): Error | void {
    if (!props) return new Error('');
    const foundInvalid = Object.keys(props).find(key => !props[key])
    if(foundInvalid) return new Error(`property ${foundInvalid} is required`)
  }
}