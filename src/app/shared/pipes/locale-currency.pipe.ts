import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from '../../core/services';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'localeCurrency', pure: false })
export class LocaleCurrencyPipe implements PipeTransform {

    constructor(private localeService: LocaleService, private currencyPipe: CurrencyPipe) {
    }

    transform(
        value: any,
        currencyCode?: string,
        display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
        digitsInfo?: string)
        : string | null {

        return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, this.localeService.locale);
    }
}
