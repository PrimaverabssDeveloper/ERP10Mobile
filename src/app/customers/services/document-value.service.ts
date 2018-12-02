import { Injectable } from '@angular/core';
import { DocumentValue, DocumentValueType } from '../entities';
import { LocaleService } from '../../core/services';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MoneyValue, LocalizedString } from '../../core/entities';

@Injectable({
    providedIn: 'root',
})
export class DocumentValueService {

    constructor(
        private currencyPipe: CurrencyPipe,
        private datePipe: DatePipe,
        private localeService: LocaleService
    ) {}

    getDocumentValueLabelLocalized(documentValue: DocumentValue, short?: boolean): string {
        if (!documentValue) {
            return null;
        }

        return this.getLocalizedString(documentValue.label, short);
    }

    getDocumentValueValueAsString(documentValue: DocumentValue): string {

        if (!documentValue) {
            return null;
        }

        let returnValue: string;

        switch (documentValue.type) {
            case DocumentValueType.string:
            case DocumentValueType.number:
                returnValue = `${documentValue.value}`;
                break;
            case DocumentValueType.date:
                returnValue = this.datePipe.transform(documentValue.value, 'shortDate');
                break;
            case DocumentValueType.money:
                const moneyValue = documentValue.value as MoneyValue;
                if (moneyValue) {
                    returnValue = this.currencyPipe.transform(moneyValue.value, moneyValue.currency);
                }
                break;
            case DocumentValueType.precentage:
                returnValue = `${documentValue.value} %`;
                break;
            case DocumentValueType.localizedString:
                const localizedString = documentValue.value as LocalizedString;
                if (localizedString) {
                    returnValue = this.getLocalizedString(localizedString);
                }
                break;
        }

        return returnValue;
    }

    getDocumentLabelForKey(documentValues: DocumentValue[], key: string, separator?: string) {
        if (!documentValues || !key) {
            return null;
        }

        let finalValue: any;
        const subKeys = key.split('|');

        // only works for strings
        if (subKeys.length > 1) {

            separator = separator ? ` ${separator} ` : ' ';

            for (const subKey of subKeys) {
                const value = documentValues.find(hi => hi.key === subKey);
                if (value) {
                    finalValue = finalValue ? `${finalValue}${separator}${value.value}` : value.value;
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

    private getLocalizedString(localizedString: LocalizedString, short?: boolean): string {
        const currentLanguage = this.localeService.language;

        const currentLanguageLocalizedString = localizedString[currentLanguage];

        if (!currentLanguageLocalizedString) {
            return;
        }

        return short ? currentLanguageLocalizedString.short : currentLanguageLocalizedString.full;
    }
}
