# Insert Usecase

## Main Flow

1. deverá cadastrar um chave-valor
2. deverá ser possível cadastrar um valor com expiração em milliseconds
3. deverá ser possível cadastrar um valor com expiração em uma data (i.e. new Date())

## Alternative flow: a chave deve ser valida

1. throw exception: "key should be not null"

## Alternative flow: o valor deve ser válido

1. throw exception: "value should be not null"

## Alternative flow: a expiração deve ser um number ou date

1. throw exception: "exp should be type of number or date instance"
