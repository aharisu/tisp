import Env from './env';
import TAny from './type/TAny';
import TClosure from './type/TClosure';
import TCons, { ListBuilder } from './type/TCons';
import TFunction from './type/TFunction';
import TSymbol from './type/TSymbol';
import TSyntax from './type/TSyntax';

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
    } else if (head instanceof TSyntax) {
      const syntax = head;
      const args = expr.Cdr;

      return syntax.apply(args, env);
    } else if (head instanceof TClosure) {
      const closure = head;
      const args = expr.Cdr;

      return closure.apply(args, env);
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
