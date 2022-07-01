import TAny from './TAny';
import Nil, { TNil } from './TNil';

export default class TCons extends TAny {
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
}
