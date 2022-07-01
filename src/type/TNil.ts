import TAny from './TAny';
import TList from './TList';

export class TNil extends TAny implements TList {
  toString(): string {
    return '()';
  }

  public length(): number {
    return 0;
  }

  [Symbol.iterator]() {
    return {
      next(): IteratorResult<TAny> {
        return {
          done: true,
          value: undefined,
        };
      },
    };
  }
}

const Nil = new TNil();
export default Nil;
