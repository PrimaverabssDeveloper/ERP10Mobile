import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, Platform } from '@ionic/angular';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { SERVICES, StorageService, AuthenticationService, TokenInterceptorService } from './services';
import { NativeStorageService } from './services/storage/native-storage.service';
import { LocalStorageService } from './services/storage/local-storage.service';
import { AppSettings } from './app-settings';
import { Router } from '@angular/router';

export function initAuthentication(authentication: AuthenticationService): () => Promise<any> {
    return (): Promise<any> => {
        return authentication.init();
    };
}

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
        AppSettings,
        SafariViewController,
        NativeStorage,
        {
            provide: StorageService,
            useFactory: (nativeStorage: NativeStorage, platform: Platform) => {
                if (platform.is('cordova')) {
                    return new NativeStorageService(nativeStorage);
                } else {
                    return new LocalStorageService();
                }
            },
            deps: [NativeStorage, Platform]
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initAuthentication,
            multi: true,
            deps: [AuthenticationService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true,
            deps: [AuthenticationService, Router]
        }
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
