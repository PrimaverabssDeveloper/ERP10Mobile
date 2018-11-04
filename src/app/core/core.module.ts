import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { SERVICES } from './services';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [],
    providers: [
        SERVICES,
        SafariViewController,
        NativeStorage
    ],
    entryComponents: []
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
