import { Pipe, PipeTransform } from '@angular/core';

/**
 *  Returns the absolute value of a number.
 *
 * @export
 * @class AbsolutePipe
 * @implements {PipeTransform}
 */
@Pipe({name: 'absolute'})
export class AbsolutePipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
