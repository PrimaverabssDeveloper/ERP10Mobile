import { OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export abstract class PinComponentBase implements OnInit {

    private loading: HTMLIonLoadingElement;

    pin: string[];
    message: string;
    errorMessage: string;
    resetPinEnabled: boolean;

    constructor(
        protected modalController: ModalController,
        protected loadingController: LoadingController,
        protected alertController: AlertController,
        protected translate: TranslateService
    ) {
        this.pin = [null, null, null, null];
    }

    /**
    * Execute on initialization.
    *
    * @memberof PinDialogComponent
    */
    async ngOnInit() {

    }

    async dismissAction() {
        await this.modalController.dismiss(false);
    }

    async keyPressed(value: string) {
        this.errorMessage = null;

        for (let index = 0; index < 4; index++) {
            if (!this.pin[index]) {
                this.pin[index] = value;

                if (index === 3) {
                    const finalPin = this.pin.join('');
                    this.onPinReady(finalPin);
                }

                break;
            }
        }
    }

    async clearPinAction() {
        this.clearPin();
    }

    async resetPinAction() {
        if (this.resetPinEnabled) {
            const okButton = await this.translate.get('SHARED.ALERTS.OK').toPromise();
            const message = await this.translate.get('HUMAN_RESOURCES.PIN_COMPONENT.RESET_PIN_ALERT_MESSAGE').toPromise();
            const alert = await this.alertController.create({
                message: message,
                buttons: [
                    {
                        text: okButton,
                        handler: () => this.modalController.dismiss(false)
                    }
                ]
            });

            await alert.present();
        }
    }

    clearPin() {
        this.pin = [null, null, null, null];
    }

    abstract onPinReady(pin: string);

    // #region 'Protected Methods'

    /**
     * Show's loading.
     *
     * @protected
     * @returns Promise
     * @memberof BasePage
     */
    protected async showLoading(): Promise<void> {
        if (this.loading) {
            return;
        }

        this.loading = await this.loadingController.create();

        return await this.loading.present();
    }

    /**
     * Dismiss Loading.
     *
     * @protected
     * @returns Promise
     * @memberof BasePage
     */
    protected async hideLoading(): Promise<void> {

        if (!this.loading) {
            return;
        }

        await this.loading.dismiss();
        this.loading = null;
    }
}
