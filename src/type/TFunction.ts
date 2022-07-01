import TAny from './TAny';
import TCons from './TCons';
import { TNil } from './TNil';

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

  public apply(args: TCons | TNil, argCount: number): TAny {
    if (argCount < this.numRequire) {
      throw new Error(
        `必須引数が足りません。${this.toString()} 必須:${
          this.numRequire
        } 取得:${args}`
      );
    }
    if (!this.hasRest && argCount > this.numRequire) {
      throw new Error(
        `必須引数が多すぎます。${this.toString()} 必須:${
          this.numRequire
        } 取得:${args}`
      );
    }

    const requireArgs = [] as TAny[];
    const restArgs = [] as TAny[];
    let count = 0;
    for (const arg of args) {
      if (count < this.numRequire) {
        requireArgs.push(arg);
      } else {
        restArgs.push(arg);
      }
      ++count;
    }

    return this.body(requireArgs, restArgs);
  }
}
