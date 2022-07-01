import TAny from './TAny';

export default class TFunction extends TAny {
  private name: string;
  private numRequire: number;
  private hasRest: boolean;
  private body: (requireArgs: TAny[], restArgs: TAny[]) => TAny;

  public constructor(
    name: string,
    numRequire: number,
    hasRest: boolean,
    body: (requireArgs: TAny[], restArgs: TAny[]) => TAny
  ) {
    super();
    this.name = name;
    this.numRequire = numRequire;
    this.hasRest = hasRest;
    this.body = body;
  }

  public toString(): string {
    return '#fun:' + this.name;
  }
}
