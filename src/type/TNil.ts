import TAny from './TAny';

export class TNil extends TAny {
  toString(): string {
    return '()';
  }
}

const Nil = new TNil();
export default Nil;
