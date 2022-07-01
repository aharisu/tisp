import TAny from './TAny';

export default interface TList {
  length(): number;
  [Symbol.iterator](): Iterator<TAny>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isList(expr: any): expr is TList {
  return (
    typeof expr.length === 'function' &&
    typeof expr[Symbol.iterator] === 'function'
  );
}
