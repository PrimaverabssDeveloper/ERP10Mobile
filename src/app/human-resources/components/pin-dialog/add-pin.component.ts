import { PinComponentBase } from './pin.component.base';
import { Component, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './pin.component.html',
    styleUrls: ['./pin.component.scss']
})
export class AddPinComponent extends PinComponentBase {
    resetPin: () => Promise<any>;
    @Input() addPin: (pin: string) => Promise<boolean>;

    constructor(
        protected modalController: ModalController,
        protected loadingController: LoadingController,
        protected alertController: AlertController,
        protected translate: TranslateService
        ) {
            super(modalController, loadingController, alertController, translate);

        this.resetPinEnabled = false;
        this.message = 'PIN';
    }

    async onPinReady(pin: string): Promise<any> {
        await this.showLoading();
        const success = await this.addPin(pin);
        this.modalController.dismiss(success);
        await this.hideLoading();
    }
}
