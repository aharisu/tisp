import TAny from './type/TAny';
import { register as TNumberRegister } from './type/TNumber';
import { register as TSyntaxRegister } from './type/TSyntax';
import { register as TypeRegister } from './type';
import TSymbol from './type/TSymbol';

export default class Env {
  private global: { [name: string]: TAny } = {};
  private frames: { [name: string]: TAny }[] = [];

  public lookup(symbol: TSymbol): TAny | undefined {
    const name = symbol.Name;
    for (let index = this.frames.length - 1; index >= 0; --index) {
      if (name in this.frames[index]) {
        return this.frames[index][name];
      }
    }

    return this.global[name];
  }

  public addGlobal(symbol: TSymbol, expr: TAny) {
    this.global[symbol.Name] = expr;
  }

  public pushFrame() {
    this.frames.push({});
  }

  public popFrame() {
    this.frames.pop();
  }

  public let(symbol: TSymbol, expr: TAny) {
    if (this.frames.length) {
      this.frames[this.frames.length - 1][symbol.Name] = expr;
    } else {
      this.global[symbol.Name] = expr;
    }
  }

  public set(symbol: TSymbol, expr: TAny): boolean {
    const name = symbol.Name;
    for (let index = this.frames.length - 1; index >= 0; --index) {
      if (name in this.frames[index]) {
        this.frames[index][name] = expr;
        return true;
      }
    }

    if (name in this.global) {
      this.global[name] = expr;
      return true;
    }

    return false;
  }
}

export function registerAll(env: Env) {
  TypeRegister(env);
  TNumberRegister(env);
  TSyntaxRegister(env);
}
