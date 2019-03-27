import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { COMPONENTS } from './components';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { SERVICES } from './services';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SharedModule
    ],
    declarations: [COMPONENTS],
    providers: [SERVICES],
    exports: [COMPONENTS],
    entryComponents: []
})
export class SalesChartsModule {
}
