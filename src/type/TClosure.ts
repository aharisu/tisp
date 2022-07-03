import Env from '../env';
import { teval } from '../eval';
import TAny from './TAny';
import { isList } from './TList';
import Nil from './TNil';
import TSymbol from './TSymbol';

export default class TClosure extends TAny {
  private parameters: TSymbol[];
  private numRequire: number;
  private body: TAny[];

  public constructor(parameters: TSymbol[], numRequire: number, body: TAny[]) {
    super();
    this.parameters = parameters;
    this.numRequire = numRequire;
    this.body = body;
  }

  toString(): string {
    return '#closure';
  }

  public apply(args: TAny, env: Env): TAny {
    if (isList(args)) {
      const length = args.length();
      if (length < this.numRequire) {
        throw new Error(
          `必須引数が足りません。${this.toString()} 必須:${
            this.numRequire
          } 取得:${args}`
        );
      }

      try {
        env.pushFrame();

        let count = 0;
        for (const arg of args) {
          if (count < this.numRequire) {
            env.let(this.parameters[count], arg);
          }
          ++count;
        }

        let result = Nil as TAny;
        for (const expr of this.body) {
          result = teval(expr, env);
        }

        return result;
      } finally {
        env.popFrame();
      }
    } else {
      throw new Error("can't apply improper list: " + args.toString());
    }
  }
}
