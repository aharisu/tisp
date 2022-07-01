import { EOF, makeReader, read } from '../read';
import { False, True } from '../type/TBool';
import { ListBuilder } from '../type/TCons';
import Nil from '../type/TNil';
import TNumber from '../type/TNumber';
import TString from '../type/TString';
import TSymbol from '../type/TSymbol';

test('read empty', () => {
  const reader = makeReader(`

       `);
  expect(() => read(reader)).toThrow(EOF);
});

test('read comment', () => {
  const reader = makeReader(` ;1 2 3
            4
            `);

  expect(read(reader)).toEqual(new TNumber(4));
});

describe('read string', () => {
  test('one line', () => {
    const reader = makeReader('"aiueo"');
    expect(read(reader)).toEqual(new TString('aiueo'));
  });

  test('two line', () => {
    const reader = makeReader(`
            "1 + (1 - 3) = -1"
            "3 * (4 / 2) - 12 = -6   "
    `);
    expect(read(reader)).toEqual(new TString('1 + (1 - 3) = -1'));
    expect(read(reader)).toEqual(new TString('3 * (4 / 2) - 12 = -6   '));
  });
});

describe('read integer', () => {
  test('1', () => {
    const reader = makeReader('1');
    expect(read(reader)).toEqual(new TNumber(1));
  });

  test('+1', () => {
    const reader = makeReader('+1');
    expect(read(reader)).toEqual(new TNumber(1));
  });

  test('-1', () => {
    const reader = makeReader('-1');
    expect(read(reader)).toEqual(new TNumber(-1));
  });

  test('0x1234', () => {
    const reader = makeReader('0x1234');
    expect(read(reader)).toEqual(new TNumber(0x1234));
  });

  test('+0x1234', () => {
    const reader = makeReader('+0x1234');
    expect(read(reader)).toEqual(new TNumber(+0x1234));
  });

  test('-0x1234', () => {
    const reader = makeReader('-0x1234');
    expect(read(reader)).toEqual(new TNumber(-0x1234));
  });
});

describe('read float number', () => {
  test('1', () => {
    const reader = makeReader('1.0');
    expect(read(reader)).toEqual(new TNumber(1.0));
  });

  test('+1.0', () => {
    const reader = makeReader('+1');
    expect(read(reader)).toEqual(new TNumber(1));
  });

  test('-1.0', () => {
    const reader = makeReader('-1.0');
    expect(read(reader)).toEqual(new TNumber(-1.0));
  });

  test('3.14', () => {
    const reader = makeReader('3.14');
    expect(read(reader)).toEqual(new TNumber(3.14));
  });

  test('0.5', () => {
    const reader = makeReader('0.5');
    expect(read(reader)).toEqual(new TNumber(0.5));
  });
});

describe('read symbol', () => {
  test('symbol', () => {
    const reader = makeReader('symbol');
    expect(read(reader)).toEqual(new TSymbol('symbol'));
  });

  test('s1 s2    s3', () => {
    const reader = makeReader('s1 s2    s3');
    expect(read(reader)).toEqual(new TSymbol('s1'));
    expect(read(reader)).toEqual(new TSymbol('s2'));
    expect(read(reader)).toEqual(new TSymbol('s3'));
  });
  test('+ - +1-2 -2*3/4', () => {
    const reader = makeReader('+ - +1-2 -2*3/4');
    expect(read(reader)).toEqual(new TSymbol('+'));
    expect(read(reader)).toEqual(new TSymbol('-'));
    expect(read(reader)).toEqual(new TSymbol('+1-2'));
    expect(read(reader)).toEqual(new TSymbol('-2*3/4'));
  });

  test('special symbol (true, false, nil)', () => {
    const reader = makeReader('true false nil');
    expect(read(reader)).toEqual(True);
    expect(read(reader)).toEqual(False);
    expect(read(reader)).toEqual(Nil);
  });
});

describe('read Emoji', () => {
  test('🍦', () => {
    const reader = makeReader('🍦');
    expect(read(reader)).toEqual(new TSymbol('🍦'));
  });

  test('🌑🌒', () => {
    const reader = makeReader('🌑🌒');
    expect(read(reader)).toEqual(new TSymbol('🌑🌒'));
  });
});

describe('read list', () => {
  test('empty list', () => {
    const reader = makeReader('()');
    expect(read(reader)).toEqual(Nil);
  });

  test('(1 2 3)', () => {
    const reader = makeReader('(1 2 3)');

    const builder = new ListBuilder();
    builder.append(new TNumber(1));
    builder.append(new TNumber(2));
    builder.append(new TNumber(3));
    const list = builder.get();

    expect(read(reader)).toEqual(list);
  });

  test('(1 3.14 "hohoho" symbol)', () => {
    const reader = makeReader('(1 3.14 "hohoho" symbol)');

    const builder = new ListBuilder();
    builder.append(new TNumber(1));
    builder.append(new TNumber(3.14));
    builder.append(new TString('hohoho'));
    builder.append(new TSymbol('symbol'));
    const list = builder.get();

    expect(read(reader)).toEqual(list);
  });
});

describe('read quote', () => {
  test("'a", () => {
    const reader = makeReader("'symbol");
    const builder = new ListBuilder();
    builder.append(new TSymbol('quote'));
    builder.append(new TSymbol('symbol'));
    const list = builder.get();

    expect(read(reader)).toEqual(list);
  });

  test("'1", () => {
    const reader = makeReader("'1");
    const builder = new ListBuilder();
    builder.append(new TSymbol('quote'));
    builder.append(new TNumber(1));
    const list = builder.get();

    expect(read(reader)).toEqual(list);
  });

  test("'(1 2 3)", () => {
    const reader = makeReader("'(1 2 3)");
    const builder = new ListBuilder();
    builder.append(new TSymbol('quote'));

    const inner = new ListBuilder();
    inner.append(new TNumber(1));
    inner.append(new TNumber(2));
    inner.append(new TNumber(3));

    builder.append(inner.get());

    const list = builder.get();

    expect(read(reader)).toEqual(list);
  });
});
