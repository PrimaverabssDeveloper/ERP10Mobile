import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts currency codes to the correspondent currency symbol.
 *
 * @export
 * @class CurrencySymbolPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'currencySymbol' })
export class CurrencySymbolPipe implements PipeTransform {
  transform(code: string): string {

    let symbol: string;

    switch (code) {
      case 'USD':
        symbol = '$';
        break;
      case 'EUR':
        symbol = '€';
        break;
      case 'AOA':
        symbol = 'Kz';
        break;
      case 'MZN':
        symbol = 'MT';
        break;
      default:
        symbol = code;
        break;
    }

    return symbol;
  }
}
