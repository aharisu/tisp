import Env, { registerAll } from '../env';
import { teval } from '../eval';
import { makeReader, read } from '../read';
import TAny from '../type/TAny';
import { False } from '../type/TBool';
import TNumber from '../type/TNumber';

const env = new Env();
registerAll(env);

function readEval(str: string): TAny {
  const reader = makeReader(str);
  const expr = read(reader);
  return teval(expr, env);
}

describe('call function', () => {
  test('1 required, 1 argument', () => {
    expect(readEval('(abs 1)')).toEqual(new TNumber(1));
  });

  test('1 required, 0 argument', () => {
    expect(() => readEval('(abs)')).toThrowError();
  });

  test('1 required, 2 argument', () => {
    expect(() => readEval('(abs 1 2)')).toThrowError();
  });

  test('2 required, 2 argument', () => {
    expect(readEval('(remainder 5 2)')).toEqual(new TNumber(5 % 2));
  });

  test('2 required, 0 argument', () => {
    expect(() => readEval('(remainder)')).toThrowError();
  });

  test('2 required, 3 argument', () => {
    expect(() => readEval('(remainder 1 2 3)')).toThrowError();
  });

  test('0 required, has rest, 0 argument', () => {
    expect(readEval('(+)')).toEqual(new TNumber(0));
  });

  test('0 required, has rest, 1 argument', () => {
    expect(readEval('(+ 1)')).toEqual(new TNumber(1));
  });

  test('0 required, has rest, 3 argument', () => {
    expect(readEval('(+ 1 2 3)')).toEqual(new TNumber(6));
  });

  test('1 required, has rest, 0 argument', () => {
    expect(() => readEval('(-)')).toThrowError();
  });

  test('1 required, has rest, 1 argument', () => {
    expect(readEval('(- 1)')).toEqual(new TNumber(-1));
  });

  test('1 required, has rest, 3 argument', () => {
    expect(readEval('(- 1 2 3)')).toEqual(new TNumber(-4));
  });
});

describe('call syntax', () => {
  test('2 required, 1 optional, 2 argument', () => {
    expect(readEval('(if true 1)')).toEqual(new TNumber(1));
  });
  test('2 required, 1 optional, 3 argument', () => {
    expect(readEval('(if false 1 2)')).toEqual(new TNumber(2));
  });
  test('2 required, 1 optional, 0 argument', () => {
    expect(() => readEval('(if)')).toThrowError();
  });
  test('2 required, 1 optional, 4 argument', () => {
    expect(() => readEval('(if false 1 2 3)')).toThrowError();
  });
  test('0 required, 0 optional, has rest, 0 argument', () => {
    expect(readEval('(or)')).toEqual(False);
  });
  test('0 required, 0 optional, has rest, 1 argument', () => {
    expect(readEval('(or 1)')).toEqual(new TNumber(1));
  });
});
