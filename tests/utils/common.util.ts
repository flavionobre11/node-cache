export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function throwError(): never {
  throw new Error('Error Mock');
}
