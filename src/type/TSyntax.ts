import Env from '../env';
import { teval } from '../eval';
import TAny from './TAny';
import { False, True } from './TBool';
import { isList } from './TList';
import Nil from './TNil';
import TSymbol from './TSymbol';

export default class TSyntax extends TAny {
  private name: string;
  private numRequire: number;
  private numOptional: number;
  private hasRest: boolean;
  private body: (
    requireArgs: TAny[],
    optionalArgs: TAny[],
    restArgs: TAny[],
    env: Env
  ) => TAny;

  public constructor(
    name: string,
    numRequire: number,
    numOptional: number,
    hasRest: boolean,
    body: (
      requireArgs: TAny[],
      optionalArgs: TAny[],
      restArgs: TAny[],
      env: Env
    ) => TAny
  ) {
    super();
    this.name = name;
    this.numRequire = numRequire;
    this.numOptional = numOptional;
    this.hasRest = hasRest;
    this.body = body;
  }

  toString(): string {
    return '#syntax:' + this.name;
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
      if (!this.hasRest && length > this.numRequire + this.numOptional) {
        throw new Error(
          `必須引数が多すぎます。${this.toString()} 必須:${
            this.numRequire
          } 取得:${args}`
        );
      }

      const requireArgs = [] as TAny[];
      const optionalArgs = [] as TAny[];
      const restArgs = [] as TAny[];

      let count = 0;
      for (const arg of args) {
        if (count < this.numRequire) {
          requireArgs.push(arg);
        } else if (this.numRequire + this.numOptional) {
          optionalArgs.push(arg);
        } else {
          restArgs.push(arg);
        }
        ++count;
      }

      return this.body(requireArgs, optionalArgs, restArgs, env);
    } else {
      throw new Error("can't apply improper list: " + args.toString());
    }
  }
}

function isFalse(expr: TAny): boolean {
  return expr === False || expr === Nil;
}

function syntaxIf(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  const condition = teval(requireArgs[0], env);
  if (isFalse(condition)) {
    if (optionalArgs.length) {
      return teval(optionalArgs[0], env);
    } else {
      return Nil;
    }
  } else {
    return teval(requireArgs[1], env);
  }
}

function syntaxOr(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  let condition = False;
  for (const expr of restArgs) {
    const result = teval(expr, env);
    condition = result;
    if (!isFalse(result)) {
      break;
    }
  }

  return condition;
}

function syntaxAnd(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  let condition = True;
  for (const expr of restArgs) {
    const result = teval(expr, env);
    condition = result;
    if (isFalse(result)) {
      break;
    }
  }

  return condition;
}

function syntaxBegin(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  let result = Nil as TAny;
  for (const expr of restArgs) {
    result = teval(expr, env);
  }

  return result;
}

function syntaxLocal(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  env.pushFrame();

  let result = Nil as TAny;
  for (const expr of restArgs) {
    console.log(expr.toString());
    result = teval(expr, env);
  }

  env.popFrame();

  console.log(result);
  return result;
}

function syntaxLet(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  //TODO letはlocal環境のトップレベル文脈でのみ実行許可にする
  const symbol = requireArgs[0];
  if (symbol instanceof TSymbol) {
    const val = teval(requireArgs[1], env);
    env.let(symbol, val);

    return Nil;
  } else {
    throw new Error('require symbol but got ' + symbol.toString());
  }
}

function syntaxSet(
  requireArgs: TAny[],
  optionalArgs: TAny[],
  restArgs: TAny[],
  env: Env
): TAny {
  const symbol = requireArgs[0];
  if (symbol instanceof TSymbol) {
    const val = teval(requireArgs[1], env);
    if (env.set(symbol, val)) {
      return Nil;
    } else {
      throw new Error('variable not found: ' + symbol.toString());
    }
  } else {
    throw new Error('require symbol but got ' + symbol.toString());
  }
}

export function register(env: Env) {
  env.addGlobal(new TSymbol('if'), new TSyntax('if', 2, 1, false, syntaxIf));
  env.addGlobal(new TSymbol('or'), new TSyntax('or', 0, 0, true, syntaxOr));
  env.addGlobal(new TSymbol('and'), new TSyntax('and', 0, 0, true, syntaxAnd));
  env.addGlobal(
    new TSymbol('begin'),
    new TSyntax('begin', 0, 0, true, syntaxBegin)
  );
  env.addGlobal(
    new TSymbol('local'),
    new TSyntax('local', 0, 0, true, syntaxLocal)
  );
  env.addGlobal(new TSymbol('let'), new TSyntax('let', 2, 0, false, syntaxLet));
  env.addGlobal(
    new TSymbol('set!'),
    new TSyntax('set!', 2, 0, false, syntaxSet)
  );
}
