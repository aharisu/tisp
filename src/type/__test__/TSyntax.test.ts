import Env, { registerAll } from '../../env';
import { teval } from '../../eval';
import { makeReader, read } from '../../read';
import TAny from '../TAny';
import { False, True } from '../TBool';
import TClosure from '../TClosure';
import Nil from '../TNil';
import TNumber from '../TNumber';
import TSymbol from '../TSymbol';

function readEval(str: string): TAny {
  const env = new Env();
  registerAll(env);

  const reader = makeReader(str);
  const expr = read(reader);
  return teval(expr, env);
}

describe('if', () => {
  test('(if)', () => {
    const result = () =>
      readEval(`
    (if)
    `);
    expect(result).toThrowError();
  });

  test('(if 1)', () => {
    const result = () =>
      readEval(`
    (if 1)
    `);
    expect(result).toThrowError();
  });

  test('(if 1 2)', () => {
    const result = readEval(`
    (if 1 2)
    `);
    expect(result).toEqual(new TNumber(2));
  });

  test('(if false 2)', () => {
    const result = readEval(`
    (if false 2)
    `);
    expect(result).toEqual(Nil);
  });

  test('(if 1 2 3)', () => {
    const result = readEval(`
    (if 1 2 3)
    `);
    expect(result).toEqual(new TNumber(2));
  });

  test('(if false 2 3)', () => {
    const result = readEval(`
    (if false 2 3)
    `);
    expect(result).toEqual(new TNumber(3));
  });

  test('(if 1 2 3 4)', () => {
    const result = () =>
      readEval(`
    (if 1 2 3 4)
    `);
    expect(result).toThrowError();
  });
});

describe('or', () => {
  test('(or)', () => {
    const result = readEval(`
    (or)
    `);
    expect(result).toEqual(False);
  });

  test('(or 1)', () => {
    const result = readEval(`
    (or 1)
    `);
    expect(result).toEqual(new TNumber(1));
  });

  test('(or 1 2)', () => {
    const result = readEval(`
    (or 1 2)
    `);
    expect(result).toEqual(new TNumber(1));
  });

  test('(or false 1 2)', () => {
    const result = readEval(`
    (or false 1 2)
    `);
    expect(result).toEqual(new TNumber(1));
  });
});

describe('and', () => {
  test('(and)', () => {
    const result = readEval(`
    (and)
    `);
    expect(result).toEqual(True);
  });

  test('(and 1)', () => {
    const result = readEval(`
    (and 1)
    `);
    expect(result).toEqual(new TNumber(1));
  });

  test('(and 1 2)', () => {
    const result = readEval(`
    (and 1 2)
    `);
    expect(result).toEqual(new TNumber(2));
  });

  test('(and false 1 2)', () => {
    const result = readEval(`
    (and false 1 2)
    `);
    expect(result).toEqual(False);
  });
});

describe('begin', () => {
  test('(begin)', () => {
    const result = readEval(`
    (begin)
    `);
    expect(result).toEqual(Nil);
  });

  test('(begin 1)', () => {
    const result = readEval(`
    (begin 1)
    `);
    expect(result).toEqual(new TNumber(1));
  });

  test('(begin 1 2)', () => {
    const result = readEval(`
    (begin 1 2)
    `);
    expect(result).toEqual(new TNumber(2));
  });
});

describe('local variable', () => {
  test('let error', () => {
    const result = () =>
      readEval(`
        (let 1 2)
      `);
    expect(result).toThrowError();
  });

  test('let', () => {
    const result = readEval(`
    (begin
      (let a 1)
      a)
    `);
    expect(result).toEqual(new TNumber(1));
  });

  test('local var', () => {
    const result = readEval(`
    (local
      (let a 1)
      a)
    `);
    expect(result).toEqual(new TNumber(1));
  });

  test('shadowing', () => {
    const result = readEval(`
    (begin
      (let a 1)
      (local
        (let a 2)
        a))
    `);
    expect(result).toEqual(new TNumber(2));
  });

  test('nest', () => {
    const result = readEval(`
    (begin
      (let a 1)
      (local
        (let a 2)
        (local
          (let a 3)
          a)))
    `);
    expect(result).toEqual(new TNumber(3));
  });

  test('nest', () => {
    const result = readEval(`
    (begin
      (let a 1)
      (local
        (let a 2)
        (local
          (let a 3))
        a))
    `);
    expect(result).toEqual(new TNumber(2));
  });
});

describe('set', () => {
  test('set not symbol', () => {
    const result = () =>
      readEval(`
        (set! 1 2)
      `);
    expect(result).toThrowError();
  });

  test('variable not found', () => {
    const result = () =>
      readEval(`
        (set! a 1)
      `);
    expect(result).toThrowError();
  });

  test('variable overwrite', () => {
    const result = readEval(`
        (begin
          (let a 1)
          (set! a 2)
          a)
      `);
    expect(result).toEqual(new TNumber(2));
  });

  test('nest variable overwrite', () => {
    const result = readEval(`
        (local
          (let a 1)
          (local
            (let a 2)
            (set! a 3))
          a)
      `);
    expect(result).toEqual(new TNumber(1));
  });
});

describe('fun', () => {
  test('fun not parameter', () => {
    const result = () => readEval('(fun)');
    expect(result).toThrowError();
  });

  test('fun', () => {
    const result = readEval('(fun ())');
    expect(result).toEqual(new TClosure([], 0, []));
  });

  test('fun 2 parameters', () => {
    const result = readEval('(fun (a b))');
    expect(result).toEqual(
      new TClosure([new TSymbol('a'), new TSymbol('b')], 2, [])
    );
  });

  test('fun 2 parameters, 2 bodies', () => {
    const result = readEval('(fun (a b) 1 2)');
    expect(result).toEqual(
      new TClosure([new TSymbol('a'), new TSymbol('b')], 2, [
        new TNumber(1),
        new TNumber(2),
      ])
    );
  });

  test('fun call', () => {
    const result = readEval('((fun () 1))');
    expect(result).toEqual(new TNumber(1));
  });

  test('fun call with arguments', () => {
    const result = readEval('((fun (a b) (+ a b)) 1 2)');
    expect(result).toEqual(new TNumber(3));
  });

  test('fun call multiple bodies', () => {
    const result = readEval(`
      ((fun (a b)
            (let c 3)
            (+ a b c)) 1 2)
      `);
    expect(result).toEqual(new TNumber(6));
  });
});
