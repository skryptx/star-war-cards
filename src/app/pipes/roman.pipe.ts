import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roman',
  standalone: true,
})
export class RomanPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }

    return this.numberToRoman(value);
  }

  numberToRoman(numberToConvert: number): string {
    let numerals = '';
    const romanNumberList: Record<string, number> = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XV: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let current: number;

    // tslint:disable-next-line: forin
    for (const key in romanNumberList) {
      current = Math.floor(numberToConvert / romanNumberList[key]);
      if (current >= 0) {
        for (let i = 0; i < current; i++) {
          numerals += key;
        }
      }
      numberToConvert = numberToConvert % romanNumberList[key];
    }

    return numerals;
  }
}
