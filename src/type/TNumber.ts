import TAny from './TAny';

export default class TNumber extends TAny {
  private value: number;

  public constructor(value: number) {
    super();
    this.value = value;
  }

  toString(): string {
    return this.value.toString(10);
  }

  get Value(): number {
    return this.value;
  }
}
