import { EventEmitter, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { SalesSettings } from '../entities';
import { SalesStorageService } from './sales-storage.service';

/**
 * Store and retrive sales settings.
 *
 * @export
 * @class SalesSettingsService
 */
@Injectable({
    providedIn: 'root',
})
export class SalesSettingsService {

    // #region 'Private Properteis'

    private useReferenceCurrencySettingSource = new Subject<{ oldValue: boolean, newValue: boolean }>();
    private showAggregateDataSettingSource = new Subject<{ oldValue: boolean, newValue: boolean }>();
    private showDailySalesSettingSource = new Subject<{ oldValue: boolean, newValue: boolean }>();

    private useReferenceCurrencySetting$ = this.useReferenceCurrencySettingSource.asObservable();
    private showAggregateDataSetting$ = this.showAggregateDataSettingSource.asObservable();
    private showDailySalesSetting$ = this.showDailySalesSettingSource.asObservable();
    
    id: string;

    // #endregion

    // #region 'Public Properteis'

    /**
     * Event that notifies when the 'useReferenceCurrency' setting value is changed.
     *
     * @readonly
     * @type {Observable<{oldValue: boolean, newValue: boolean}>}
     * @memberof SalesService
     */
    get useReferenceCurrencySettingChanged(): Observable<{ oldValue: boolean, newValue: boolean }> {
        return this.useReferenceCurrencySetting$;
    }

    /**
     * Event that notifies when the 'showAggregateData' setting value is changed.
     *
     * @readonly
     * @type {Observable<{oldValue: boolean, newValue: boolean}>}
     * @memberof SalesService
     */
    get showAggregateDataSettingChanged(): Observable<{ oldValue: boolean, newValue: boolean }> {
        return this.showAggregateDataSetting$;
    }

    /**
     * Event that notifies when the 'showDailySales' setting value is changed.
     *
     * @readonly
     * @type {Observable<{oldValue: boolean, newValue: boolean}>}
     * @memberof SalesService
     */
    get showDailySalesSettingChanged(): Observable<{ oldValue: boolean, newValue: boolean }> {
        return this.showDailySalesSetting$;
    }

    // #endregion

    /**
     * Creates an instance of SalesSettingsService.
     *
     * @param {SalesStorageService} storage
     * @memberof SalesSettingsService
     */
    constructor(private storage: SalesStorageService) {
    }

    /**
     * Stores the sales settings.
     *
     * @param {SalesSettings} settings
     * @memberof SalesService
     */
    async updateSettingsAsync(settings: SalesSettings) {
        const currentSettings = await this.getSettingsAsync();

        await this.storage.setData('SETTINGS', settings, true);

        // if the useReferenceCurrency setting changed, emit an event
        if (currentSettings.useReferenceCurrency !== settings.useReferenceCurrency) {
            const eventData = {
                oldValue: currentSettings.useReferenceCurrency,
                newValue: settings.useReferenceCurrency
            };

            this.useReferenceCurrencySettingSource.next(eventData);
        }

        // if the showAggregateData setting changed, emit an event
        if (currentSettings.showAggregateData !== settings.showAggregateData) {
            const eventData = {
                oldValue: currentSettings.showAggregateData,
                newValue: settings.showAggregateData
            };

            this.showAggregateDataSettingSource.next(eventData);
        }

        // if the showDailySales setting changed, emit an event
        if (currentSettings.showDailySales !== settings.showDailySales) {
            const eventData = {
                oldValue: currentSettings.showDailySales,
                newValue: settings.showDailySales
            };

            this.showDailySalesSettingSource.next(eventData);
        }
    }

    /**
     * Provide the sales setting.
     *
     * @returns {Promise<SalesSettings>}
     * @memberof SalesService
     */
    async getSettingsAsync(): Promise<SalesSettings> {
        let settings: SalesSettings;

        try {
            settings = await this.storage.getData<SalesSettings>('SETTINGS', true);
        } catch (error) {
            console.log('no settings stored yet');
        }

        // create the default settings state
        if (!settings) {
            settings = {
                useReferenceCurrency: false,
                showAggregateData: true,
                showDailySales: true
            };
        }

        return settings;
    }

    /**
     * Return if the reference currency must be used instead of the default currency.
     * The reference currency is also known as 'reporting currency'.
     *
     * @returns {Promise<boolean>}
     * @memberof SalesService
     */
    async getUseReferenceCurrencySettingValueAsync(): Promise<boolean> {
        const settings = await this.getSettingsAsync();
        return settings.useReferenceCurrency;
    }

    /**
     * Return the setting value that defines if the daily sales must be presented to the user.
     *
     * @returns {Promise<boolean>}
     * @memberof SalesSettingsService
     */
    async getShowDailySalesSettingSettingValueAsync(): Promise<boolean> {
        const settings = await this.getSettingsAsync();
        return settings.showDailySales;
    }

    /**
     * Returns the setting value that defines if the agggregated sales data must be presented to the user.
     *
     * @returns {Promise<boolean>}
     * @memberof SalesSettingsService
     */
    async getShowAggregateDataSettingValueAsync(): Promise<boolean> {
        const settings = await this.getSettingsAsync();
        return settings.showAggregateData;
    }
}
