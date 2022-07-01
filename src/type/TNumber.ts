import Env from '../env';
import TAny from './TAny';
import { False, True } from './TBool';
import TFunction from './TFunction';
import TSymbol from './TSymbol';

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

function toNumber(expr: TAny): number {
  if (expr instanceof TNumber) {
    return expr.Value;
  } else {
    throw new Error('number required: ' + expr.toString());
  }
}

function add(requireArgs: TAny[], restArgs: TAny[]): TAny {
  let num = 0;
  for (const expr of restArgs) {
    num += toNumber(expr);
  }

  return new TNumber(num);
}

function sub(requireArgs: TAny[], restArgs: TAny[]): TAny {
  let num = toNumber(requireArgs[0]);
  if (restArgs.length) {
    for (const expr of restArgs) {
      num -= toNumber(expr);
    }
  } else {
    num = 0 - num;
  }

  return new TNumber(num);
}

function mul(requireArgs: TAny[], restArgs: TAny[]): TAny {
  let num = 1;
  for (const expr of restArgs) {
    num *= toNumber(expr);
  }

  return new TNumber(num);
}

function quotient(requireArgs: TAny[], restArgs: TAny[]): TAny {
  let num = toNumber(requireArgs[0]);
  if (restArgs.length) {
    num = 1 / num;
  } else {
    for (const expr of restArgs) {
      num /= toNumber(expr);
    }
  }
  return new TNumber(num);
}

function remainder(requireArgs: TAny[], restArgs: TAny[]): TAny {
  const left = toNumber(requireArgs[0]);
  const right = toNumber(requireArgs[1]);
  return new TNumber(left % right);
}

function isZero(requireArgs: TAny[], restArgs: TAny[]): TAny {
  const num = toNumber(requireArgs[0]);
  return num === 0 ? True : False;
}

function abs(requireArgs: TAny[], restArgs: TAny[]): TAny {
  const num = toNumber(requireArgs[0]);
  return new TNumber(Math.abs(num));
}

export function register(env: Env) {
  env.addGlobal(new TSymbol('+'), new TFunction('+', 0, true, add));
  env.addGlobal(new TSymbol('-'), new TFunction('-', 1, true, sub));
  env.addGlobal(new TSymbol('*'), new TFunction('*', 0, true, mul));
  env.addGlobal(new TSymbol('/'), new TFunction('/', 1, true, quotient));
  env.addGlobal(
    new TSymbol('remainder'),
    new TFunction('remainder', 2, false, remainder)
  );
  env.addGlobal(new TSymbol('zero?'), new TFunction('zero?', 1, false, isZero));
  env.addGlobal(new TSymbol('abs'), new TFunction('abs', 1, false, abs));
}
