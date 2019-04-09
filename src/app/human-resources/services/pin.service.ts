import { Injectable } from '@angular/core';
import { HumanResourcesService } from './human-resources.service';
import { InstanceHttpRequestService, DomService, InstanceService, ModulesService, AuthenticationService } from '../../core/services';
import { ModalController } from '@ionic/angular';
import { VerifyPinComponent, AddPinComponent } from '../components';
import { HrModuleDefinition } from '../module-definition';
import { RemovePinComponent } from '../components/pin-dialog/remove-pin.component';

@Injectable({
    providedIn: 'root',
})
export class PinService {

    /**
     *
     */
    constructor(
        private modalController: ModalController,
        private modulesService: ModulesService,
        private authenticationService: AuthenticationService
        ) {
    }

    async accessAllowed(): Promise<boolean> {

        // demo has no pin
        if (this.authenticationService.isAuthenticateAsDemo) {
            return true;
        }

        let hasPin: boolean;
        try {
            hasPin = await this.verifyModuleHasPin();
        } catch (error) {
            return false;
        }

        // access allowed has it is not secured with pin
        if (!hasPin) {
            return true;
        }

        const modal = await this.modalController.create({
            component: VerifyPinComponent,
            componentProps: {
                'verifyPin': (pin: string) => this.verifyModulePin(pin),
                'resetPin': () => this.resetModulePin()
            }
        });

        await modal.present();
        const result = await modal.onDidDismiss();
        return result.data as boolean;
    }

    async enablePinDialog(): Promise<boolean> {

        // demo has no pin
        if (this.authenticationService.isAuthenticateAsDemo) {
            return;
        }

        const modal = await this.modalController.create({
            component: AddPinComponent,
            componentProps: {
                'addPin': (pin: string): Promise<Boolean> => this.setModulePin(pin),
                'resetPin': () => this.resetModulePin()
            }
        });

        await modal.present();
        const result = await modal.onDidDismiss();

        // if true, the pin is enabled
        return result.data as boolean;
    }

    async disablePinDialog(): Promise<boolean> {
        const modal = await this.modalController.create({
            component: RemovePinComponent,
            componentProps: {
                'verifyPin': (pin: string) => this.verifyModulePin(pin),
                'removePin': () => this.disableModulePin(),
                'resetPin': () => this.resetModulePin()
            }
        });

        await modal.present();
        const result = await modal.onDidDismiss();

        return result.data as boolean;
    }

    async setModulePin(pin: string): Promise<boolean> {
        return await this.modulesService.setModulePin(HrModuleDefinition.key.toLowerCase(), pin);
    }

    async verifyModulePin(pin: string): Promise<boolean> {
        return await this.modulesService.verifyModulePin(HrModuleDefinition.key, pin);
    }

    async verifyModuleHasPin(): Promise<boolean> {
        return await this.modulesService.verifyModuleHasPin(HrModuleDefinition.key);
    }

    async disableModulePin(): Promise<boolean> {
        return await this.modulesService.removeModulePin(HrModuleDefinition.key);
    }

    async resetModulePin(): Promise<any> {
        return await this.modulesService.resetModulePin(HrModuleDefinition.key);
    }
}
