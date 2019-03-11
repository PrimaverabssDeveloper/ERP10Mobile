import { Component, OnInit } from '@angular/core';
import { LocaleService } from '../../../core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './language.page.html',
    styleUrls: [
        './language.page.scss',
        '../../../shared/styles/settings.scss'
    ]
})
export class LanguagePage implements OnInit {

    // #region 'Public Properties'

    /**
     * Current selected locale.
     *
     * @type {string}
     * @memberof LanguagePage
     */
    selectedLocale: string;

    /**
     * The available languages.
     *
     * @type {{ label: string, locale: string }[]}
     * @memberof LanguagePage
     */
    availableLanguages: { label: string, locale: string }[];

    // #endregion


    // #region 'Constructor'

    /**
     * Creates an instance of LanguagePage.
     * @param {LocaleService} localeService
     * @param {TranslateService} translateService
     * @memberof LanguagePage
     */
    constructor(
        private localeService: LocaleService,
        private translateService: TranslateService
    ) {
        this.selectedLocale = this.localeService.locale;
    }

    // #endregion


    // #region 'Public Methods'

    /**
    * Execute on page initialization.
    *
    * @memberof LanguagePage
    */
    async ngOnInit() {
        this.availableLanguages = [];

        for (const locale of this.localeService.supportedLocales) {

            const languageFormatter = locale.toUpperCase().replace('-', '_');
            const langResKey = `SHELL.LANGUAGE_PAGE.LANGUAGE_${languageFormatter}`;

            const availableLanguage = {
                label: await this.translateService.get(langResKey).toPromise(),
                locale: locale
            };

            this.availableLanguages.push(availableLanguage);
        }
    }

    /**
     * Actions to be called when the user
     * change the locale/language on the interface.
     *
     * @param {string} locale
     * @memberof LanguagePage
     */
    async changeLocaleAction(locale: string) {
        this.selectedLocale = locale;
        await this.localeService.setCustomLocale(locale);
    }

    // #endregion
}
