import { Pipe, PipeTransform } from '@angular/core';

/**
 *  Returns the company key sanitized.
 *
 * @export
 * @class CompanyKeySanitizerPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'companyKeySanitizer' })
export class CompanyKeySanitizerPipe implements PipeTransform {
    transform(companyKey: string): string {
        if (!companyKey) {
            return companyKey;
        }

        const parts = companyKey.split('-');
        return parts[parts.length - 1];
    }
}
