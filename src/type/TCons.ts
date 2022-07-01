import TAny from './TAny';

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
