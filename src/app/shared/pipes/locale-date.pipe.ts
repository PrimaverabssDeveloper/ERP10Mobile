import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from '../../core/services';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'localeDate', pure: false })
export class LocaleDatePipe implements PipeTransform {

    constructor(private localeService: LocaleService, private datePipe: DatePipe) {
    }

    transform(value: any, format?: string, timezone?: string): string | null {
        return '##_' + this.datePipe.transform(value, format, timezone, this.localeService.locale);
    }
}
