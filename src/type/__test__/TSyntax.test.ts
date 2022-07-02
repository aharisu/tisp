import Env, { registerAll } from '../../env';
import { teval } from '../../eval';
import { makeReader, read } from '../../read';
import TAny from '../TAny';
import { False, True } from '../TBool';
import Nil from '../TNil';
import TNumber from '../TNumber';

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
