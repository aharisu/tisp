import TAny from './type/TAny';
import { register as TNumberRegister } from './type/TNumber';
import { register as TSyntaxRegister } from './type/TSyntax';
import { register as TypeRegister } from './type';
import TSymbol from './type/TSymbol';

export default class Env {
  private global: { [name: string]: TAny } = {};

  public lookup(symbol: TSymbol): TAny | undefined {
    return this.global[symbol.Name];
  }

  public addGlobal(symbol: TSymbol, expr: TAny) {
    this.global[symbol.Name] = expr;
  }
}

export function registerAll(env: Env) {
  TypeRegister(env);
  TNumberRegister(env);
  TSyntaxRegister(env);
}
