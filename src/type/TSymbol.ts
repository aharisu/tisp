import TAny from './TAny';

export default class TSymbol extends TAny {
  private name: string;

  public constructor(name: string) {
    super();
    this.name = name;
  }

  toString(): string {
    return this.name;
  }

  get Name(): string {
    return this.name;
  }
}
