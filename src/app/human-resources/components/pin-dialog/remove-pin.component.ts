import { PinComponentBase } from './pin.component.base';
import { Component, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './pin.component.html',
    styleUrls: ['./pin.component.scss']
})
export class RemovePinComponent extends PinComponentBase {

    @Input() verifyPin: (pin: string) => Promise<boolean>;
    @Input() removePin: () => Promise<boolean>;

    constructor(
        protected modalController: ModalController,
        protected loadingController: LoadingController,
        protected alertController: AlertController,
        protected translate: TranslateService
        ) {
        super(modalController, loadingController, alertController, translate);
        this.resetPinEnabled = true;
        this.message = 'PIN';
    }

    async onPinReady(pin: string): Promise<any> {
        await this.showLoading();
        const success = await this.verifyPin(pin);

        if (success) {
            await this.removePin();
            this.modalController.dismiss(success);
        } else {
            this.clearPin();
            this.errorMessage = await this.translate.get('HUMAN_RESOURCES.PIN_COMPONENT.INVALID_PIN_MESSAGE').toPromise();
        }

        await this.hideLoading();
    }
}
