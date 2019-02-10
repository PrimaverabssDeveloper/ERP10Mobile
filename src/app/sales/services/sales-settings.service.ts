import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    private _showDailySalesSettingChanged: EventEmitter<{ oldValue: boolean, newValue: boolean }>;
    private _showAggregateDataSettingChanged: EventEmitter<{ oldValue: boolean, newValue: boolean }>;
    private _useReferenceCurrencySettingChanged: EventEmitter<{ oldValue: boolean, newValue: boolean }>;
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
        return this._useReferenceCurrencySettingChanged.asObservable();
    }

    /**
     * Event that notifies when the 'showAggregateData' setting value is changed.
     *
     * @readonly
     * @type {Observable<{oldValue: boolean, newValue: boolean}>}
     * @memberof SalesService
     */
    get showAggregateDataSettingChanged(): Observable<{ oldValue: boolean, newValue: boolean }> {
        return this._showAggregateDataSettingChanged.asObservable();
    }

    /**
     * Event that notifies when the 'showDailySales' setting value is changed.
     *
     * @readonly
     * @type {Observable<{oldValue: boolean, newValue: boolean}>}
     * @memberof SalesService
     */
    get showDailySalesSettingChanged(): Observable<{ oldValue: boolean, newValue: boolean }> {
        return this._showDailySalesSettingChanged.asObservable();
    }

    // #endregion

    /**
     * Creates an instance of SalesSettingsService.
     *
     * @param {SalesStorageService} storage
     * @memberof SalesSettingsService
     */
    constructor(private storage: SalesStorageService) {
        this._useReferenceCurrencySettingChanged = new EventEmitter();
        this._showAggregateDataSettingChanged = new EventEmitter();
        this._showDailySalesSettingChanged = new EventEmitter();
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

            this._useReferenceCurrencySettingChanged.emit(eventData);
        }

        // if the showAggregateData setting changed, emit an event
        if (currentSettings.showAggregateData !== settings.showAggregateData) {
            const eventData = {
                oldValue: currentSettings.showAggregateData,
                newValue: settings.showAggregateData
            };

            this._showAggregateDataSettingChanged.emit(eventData);
        }

        // if the showDailySales setting changed, emit an event
        if (currentSettings.showDailySales !== settings.showDailySales) {
            const eventData = {
                oldValue: currentSettings.showDailySales,
                newValue: settings.showDailySales
            };

            this._showDailySalesSettingChanged.emit(eventData);
        }
    }

    /**
     * Provide the sales setting.
     *
     * @returns {Promise<SalesSettings>}
     * @memberof SalesService
     */
    async getSettingsAsync(): Promise<SalesSettings> {
        let settings: SalesSettings = await this.storage.getData<SalesSettings>('SETTINGS', true);

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
