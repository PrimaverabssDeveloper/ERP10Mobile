import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns the absolute value of a number.
 *
 * @export
 * @class RoundPipe
 * @implements {PipeTransform}
 */
@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
  transform(value: number): number {
    return Math.round(value);
  }
}
