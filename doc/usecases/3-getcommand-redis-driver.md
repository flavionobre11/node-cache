# Redis Driver GetCommand Usecase

## Main Flow

1. Recuperar do redis as informações relacionadas a chave de busca

## Alternative flow: propriedades invalidas

1. se não houver redisClient, entao thrown exception "redisClient is required"
2. se nao houver key, entao thrown exception "key are required"
