# Redis Driver SetCommand Usecase

## Main Flow

1. fazer parse das propriedades de configuração. Atuais:

   ```ts
   type RedisSetCommandOptions = {
     exp: string | Date;
   };
   ```

2. chamar o comando set, do client, para cadastrar um novo registro
3. se cadastro com sucesso, entao retornar `key`, `value` e `expires` (se houver opção de TTL: retornar `expires` de acordo com a opção desejada)

## Alternative flow: propriedades invalidas

1. se não houver redisClient, entao thrown exception "redisClient is required"
2. se nao houver key, entao thrown exception "key is required"
3. se nao houver value, entao thrown exception "value is required"

## Alternative flow: erro ao fazer o comando set

1. thrown exception "value not set"
