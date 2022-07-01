import Env from './env';
import TAny from './type/TAny';
import TCons, { ListBuilder } from './type/TCons';
import TFunction from './type/TFunction';
import TSymbol from './type/TSymbol';

export function teval(expr: TAny, env: Env): TAny {
  if (expr instanceof TCons) {
    const head = teval(expr.Car, env);

    if (head instanceof TFunction) {
      const func = head;
      const argBuilder = new ListBuilder();

      const cdr = expr.Cdr;
      if (cdr instanceof TCons) {
        for (const arg of cdr) {
          argBuilder.append(teval(arg, env));
        }
      }

      const args = argBuilder.get();
      const argCount = argBuilder.length();
      return func.apply(args, argCount);
    } else {
      throw new Error('Not Applicable: ' + head.toString());
    }
  } else if (expr instanceof TSymbol) {
    const v = env.lookup(expr);
    if (v) {
      return v;
    } else {
      throw new Error(`${expr.toString()} is not found`);
    }
  } else {
    return expr;
  }
}
