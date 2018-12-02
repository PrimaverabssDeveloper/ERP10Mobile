import { Pipe, PipeTransform } from '@angular/core';
import { Document, DocumentValue } from '../entities';

/**
 * Returns the value from a Document Value list that has the provided key.
 *
 * @export
 * @class ValueFromDocumentValuesPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'valueFromDocumentValues' })
export class ValueFromDocumentValuesPipe implements PipeTransform {
    transform(documentValues: DocumentValue[], key: string): number {

        if (!documentValues || !key) {
            return null;
        }

        let finalValue: any;
        const subKeys = key.split('|');

        // only works for strings
        if (subKeys.length > 1) {
            for (const subKey of subKeys) {
                const value = documentValues.find(hi => hi.key === subKey);
                if (value) {
                    finalValue = finalValue ? `${finalValue} ${value.value}` : value.value;
                }
            }
        } else {
            const value = documentValues.find(hi => hi.key === key);
            if (value) {
                finalValue = value.value;
            }
        }

        return finalValue;
    }
}
