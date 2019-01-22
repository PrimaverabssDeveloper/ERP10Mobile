import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from '../../core/services';

/**
 * Returns the localized string according to the currente user language.
 *
 * @export
 * @class LocalizedStringsPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'localizedStrings' })
export class LocalizedStringsPipe implements PipeTransform {

    constructor(private localeService: LocaleService) {
    }

    transform(value: { [key: string]: string } | string): string {
        if (!value) {
            return '';
        }

        const currentLanguage = this.localeService.language;

        if (!value[currentLanguage]) {
            return value as string;
        }

        return value[currentLanguage];
    }
}
