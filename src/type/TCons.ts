import TAny from './TAny';
import TList from './TList';
import Nil, { TNil } from './TNil';

export default class TCons extends TAny implements TList {
  private car: TAny;
  private cdr: TAny;

  public constructor(car: TAny, cdr: TAny) {
    super();
    this.car = car;
    this.cdr = cdr;
  }

  toString(): string {
    return this.car.toString() + ' ' + this.cdr.toString();
  }

  get Car(): TAny {
    return this.car;
  }

  get Cdr(): TAny {
    return this.cdr;
  }

  public setCar(expr: TAny) {
    this.car = expr;
  }

  public setCdr(expr: TAny) {
    this.cdr = expr;
  }

  public length(): number {
    let cur = this as TCons;
    let length = 1;
    for (;;) {
      if (cur.cdr instanceof TNil) {
        return length;
      } else if (cur.cdr instanceof TCons) {
        cur = cur.cdr;
        length++;
      } else {
        throw new Error('proper list required: ' + this.toString());
      }
    }
  }

  public isProper(): boolean {
    if (this.cdr === Nil) {
      return true;
    } else if (this.cdr instanceof TCons) {
      return this.cdr.isProper();
    } else {
      return false;
    }
  }

  [Symbol.iterator]() {
    let cur = this as TAny;

    return {
      next(): IteratorResult<TAny> {
        if (cur instanceof TCons) {
          const v = cur.car;
          cur = cur.cdr;
          return {
            done: false,
            value: v,
          };
        } else {
          return {
            done: true,
            value: undefined,
          };
        }
      },
    };
  }
}

export class ListBuilder {
  private len = 0;
  private head: TCons | undefined;
  private tail: TCons | undefined;

  public append(expr: TAny) {
    const cell = new TCons(expr, Nil);
    if (!this.head) {
      this.head = cell;
    }

    if (this.tail) {
      this.tail.setCdr(cell);
    }
    this.tail = cell;

    ++this.len;
  }

  public get(): TCons | TNil {
    if (this.head) {
      return this.head;
    } else {
      return Nil;
    }
  }

  public length(): number {
    return this.len;
  }
}
