import TAny from './TAny';

export default class TString extends TAny {
  private value: string;

  public constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  get Value(): string {
    return this.value;
  }
}
