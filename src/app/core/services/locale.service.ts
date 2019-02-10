import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Manage the app locale.
 * The locale will be used to translate de app
 * and on data transformation, like currency,
 * numbres and dates when converted to string.
 *
 * @export
 * @class LocaleService
 */
@Injectable({
    providedIn: 'root',
})
export class LocaleService {

    // #region 'Private Properties'
    private _locale: string;
    private _defaultLocale: string;
    private _supportedLocales: string[];
    private _localeChanged: EventEmitter<any> = new EventEmitter();
    // #endregion


    // #region 'Public Properteis'

    /**
     *  Provides the current locale code.
     *
     * @readonly
     * @type {string}
     * @memberof LocaleService
     */
    get locale(): string {
        return this._locale ? this._locale : this._defaultLocale;
    }

    /**
     * Provides the current base language code.
     * When the current locale is 'pt-PT', the provided language code will be 'pt'.
     *
     * @readonly
     * @type {string}
     * @memberof LocaleService
     */
    get language(): string {
        return this._locale.split('-')[0];
    }

    /**
     * Provides all configured locales.
     *
     * @readonly
     * @type {string[]}
     * @memberof LocaleService
     */
    get supportedLocales(): string[] {
        return this._supportedLocales;
    }

    /**
     * Event that notifies when the locale is changed.
     *
     * @readonly
     * @type {Observable<any>}
     * @memberof LocaleService
     */
    get localeChanged(): Observable<any> {
        return this._localeChanged.asObservable();
    }

    // #endregion


    // #region 'Constructor'

    /**
     * Creates an instance of LocaleService.
     * @param {TranslateService} translate
     * @memberof LocaleService
     */
    constructor(private translate: TranslateService) {

    }

    // #endregion


    // #region 'Public Methods'

    /**
     * Set the locale to be used on data transformation and translations.
     *
     * @param {string} locale
     * @memberof LocaleService
     */
    setLocale(locale: string) {

        if (!locale) {
            throw new Error('The locale can not be empty');
        }

        if (!this._supportedLocales || this._supportedLocales.length === 0) {
            throw new Error(`
                The supported locales are not defined.
                Set all supported locales first, using 'setSupportedLocales,
                and then set the current locale to be used '`);
        }

        if (this._supportedLocales.indexOf(locale) === -1) {
            throw new Error(`
                This locale is not supported.
                Only the following locales are supported: ${this._supportedLocales.join(' ,')}`);
        }

        this._locale = locale;
        this.translate.use(locale);
        this._localeChanged.emit();
    }

    /**
     * Set the default locale to be used when no locale is setted.
     * The default locale is used on data transformation and translations.
     *
     * @param {string} locale
     * @memberof LocaleService
     */
    setDefaultLocale(locale: string) {
        if (!locale) {
            throw new Error('The default locale can not be empty');
        }

        if (!this._supportedLocales || this._supportedLocales.length === 0) {
            throw new Error(`
                The supported locales are not defined.
                Set all supported locales first, using 'setSupportedLocales,
                and then set the default locale to be used '`);
        }

        if (this._supportedLocales.indexOf(locale) === -1) {
            throw new Error(`
                This locale is not supported.
                Only the following locales are supported: ${this._supportedLocales.join(' ,')}`);
        }

        this._defaultLocale = locale;

        this.translate.use(locale);
    }

    /**
     * Set the app supported locales.
     *
     * @param {string[]} locales
     * @memberof LocaleService
     */
    setSupportedLocales(locales: string[]) {

        if (this._supportedLocales) {
            throw new Error('The supported locales can only be setted once.');
        }

        if (!locales) {
            throw new Error('The list can not be empty. Provide a list with, at least, one locale');
        }

        this._supportedLocales = locales;
    }

    // #endregion
}
