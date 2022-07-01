import TAny from './TAny';

export default class TBool extends TAny {
  public toString(): string {
    if (this === True) {
      return 'true';
    } else {
      return 'false';
    }
  }
}

export const True = new TBool();
export const False = new TBool();
