import { RedisClient } from '../redis-connector';

export type RedisSetCommandOptions = { exp: number | Date };

export default class SetCommand {
  static async perform(
    redisClient: RedisClient,
    key: string,
    value: string,
    options?: RedisSetCommandOptions,
  ) {
    const { parsedOptions, expires } = SetCommand.parseOptions(options);
    const result = await redisClient.set(key, value, parsedOptions);
    if (!result) throw new Error('value not set');

    return {
      key,
      value,
      expires,
    };
  }

  private static parseOptions(options?: RedisSetCommandOptions) {
    const parsedOptions = {};
    let expires = undefined;
    if (!options)
      return {
        parsedOptions,
        expires,
      };

    const OPTIONS_TO_PARSE = {
      exp: (value) => {
        if (typeof value === 'number') {
          Reflect.set(parsedOptions, 'PX', value); // milli unix
          expires = new Date(Date.now() + value).toISOString();
        } else if (value instanceof Date) {
          Reflect.set(
            parsedOptions,
            'EXAT',
            Number((value.getTime() / 1000).toFixed(0)),
          ); // date to unix
          expires = new Date(value).toISOString();
        }
      },
    } as {
      [key in keyof Required<RedisSetCommandOptions>]: (
        param: RedisSetCommandOptions[key],
      ) => void;
    };

    const keys = Object.keys(
      options,
    ) as unknown as (keyof RedisSetCommandOptions)[];

    keys.forEach((key) => OPTIONS_TO_PARSE[key](Reflect.get(options, key)));
    return {
      parsedOptions,
      expires,
    };
  }
}
