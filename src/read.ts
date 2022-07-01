import TAny from './type/TAny';
import { False, True } from './type/TBool';
import { ListBuilder } from './type/TCons';
import Nil from './type/TNil';
import TNumber from './type/TNumber';
import TString from './type/TString';
import TSymbol from './type/TSymbol';

class StringReader {
  private chars: number[];
  private pos: number;

  public constructor(str: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.chars = Array.from(str).map((ch) => ch.codePointAt(0)!);
    this.pos = 0;
  }

  public next(): IteratorResult<number> {
    return this.get(true);
  }

  public peek(): IteratorResult<number> {
    return this.get(false);
  }

  private get(toNext: boolean): IteratorResult<number> {
    if (this.pos < this.chars.length) {
      const pos = this.pos;
      if (toNext) {
        this.pos += 1;
      }

      return {
        done: false,
        value: this.chars[pos],
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
}

export function makeReader(str: string): StringReader {
  return new StringReader(str);
}

export class EOF {}

export function read(reader: StringReader): TAny {
  return readInternal(reader);
}

function readInternal(reader: StringReader): TAny {
  skipWhitespace(reader);

  const next = reader.peek();
  if (next.done) {
    throw new EOF();
  }

  switch (next.value) {
    case 0x28: // (
      return readList(reader);

    case 0x29: // )
      throw new Error('unexpected )');

    case 0x22: // "
      return readString(reader);
    case 0x27: // '
      return readQuote(reader);
    case 0x2b: // +
    case 0x2d: // -
    case 0x30: // 0
    case 0x31: // 1
    case 0x32: // 2
    case 0x33: // 3
    case 0x34: // 4
    case 0x35: // 5
    case 0x36: // 6
    case 0x37: // 7
    case 0x38: // 8
    case 0x39: // 9
      return readNumberOrSymbol(reader);
    default:
      return readSymbol(reader);
  }
}

function readList(reader: StringReader): TAny {
  //skip first char
  reader.next();

  const builder = new ListBuilder();
  for (;;) {
    skipWhitespace(reader);
    const next = reader.peek();
    if (next.done) {
      throw new Error('シーケンスが完結する前にEOFになった');
    }

    if (next.value === 0x29) {
      // )
      //リスト完成!
      reader.next();
      return builder.get();
    } else {
      //再帰的にreadを呼び出す
      builder.append(readInternal(reader));
    }
  }
}

function readString(reader: StringReader): TAny {
  //skip first char
  reader.next();

  const acc = [] as number[];
  for (;;) {
    const next = reader.next();
    if (next.done) {
      throw new Error('文字列が完結する前にEOFになった');
    }

    if (next.value === 0x22) {
      // "
      const str = String.fromCodePoint(...acc);
      return new TString(str);
    } else {
      acc.push(next.value);
    }
  }
}

function readQuote(reader: StringReader): TAny {
  //skip first char
  reader.next();

  const expr = readInternal(reader);
  const builder = new ListBuilder();
  builder.append(new TSymbol('quote'));
  builder.append(expr);

  return builder.get();
}

function readNumberOrSymbol(reader: StringReader): TAny {
  const word = readWord(reader);

  let str = word;
  let sign = 1;
  if (str.startsWith('+')) {
    str = str.substring(1);
  }
  if (str.startsWith('-')) {
    str = str.substring(1);
    sign = -1;
  }

  const num = Number(str);
  if (str === '' || isNaN(num)) {
    return new TSymbol(word);
  } else {
    return new TNumber(num * sign);
  }
}

function readSymbol(reader: StringReader): TAny {
  const word = readWord(reader);
  if (word === 'true') {
    return True;
  } else if (word === 'false') {
    return False;
  } else if (word === 'nil') {
    return Nil;
  } else {
    return new TSymbol(word);
  }
}

function readWord(reader: StringReader): string {
  const acc = [] as number[];
  for (;;) {
    const next = reader.peek();
    if (next.done) {
      if (acc.length === 0) {
        throw new Error('ワードが存在しない');
      } else {
        return String.fromCodePoint(...acc);
      }
    }

    if (isDelimiter(next.value)) {
      return String.fromCodePoint(...acc);
    } else {
      acc.push(next.value);
      reader.next();
    }
  }
}

function isWhiteSpace(ch: number): boolean {
  switch (ch) {
    case 0x20: // space ' '
    case 0x09: // tab '\t'
    case 0x0a: // line feed '\n'
    case 0x0d: // carrige return '\r'
    case 0x0b: // vertical tab
    case 0x0c: // form feed
    case 0x85: // nextline
    case 0x200e: // left-to-right mark
    case 0x200f: // right-to-left mark
    case 0x2028: // line separator
    case 0x2029: // paragraph separator
      return true;
    default:
      return false;
  }
}

function isDelimiter(ch: number): boolean {
  if (isWhiteSpace(ch)) {
    return true;
  } else {
    switch (ch) {
      case 0x22: // "
      case 0x27: // '
      case 0x28: // (
      case 0x29: // )
        return true;
      default:
        return false;
    }
  }
}

function skipWhitespace(reader: StringReader) {
  let next = reader.peek();
  while (!next.done) {
    if (isWhiteSpace(next.value)) {
      reader.next();
      next = reader.peek();
    } else if (next.value === 0x3b) {
      // ;
      readLineComment(reader);
      next = reader.peek();
    } else {
      next = { done: true, value: undefined };
    }
  }
}

function readLineComment(reader: StringReader) {
  for (;;) {
    const next = reader.next();
    if (next.done || next.value === 0x0a) {
      break;
    }
  }
}
