import { Pipe, PipeTransform } from '@angular/core';

/**
 *  Returns the array orderes by the provided property.
 *
 * @export
 * @class OrderByPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {
    transform(array: any[], property: string): any[] {

        if (!array || array.length === 0) {
            return array;
        }

        // the property value is a number.
        if (typeof array[0][property] === 'number') {
            return array.sort((a, b) => {
                return a[property] - b[property];
            });
        }

        // the property value is a string.
        if (typeof array[0][property] === 'string') {
            return array.sort((a, b) => {
                return a[property].localeCompare(b[property]);
            });
        }

        // not order was possible. Return the original array.
        return array;
    }
}
