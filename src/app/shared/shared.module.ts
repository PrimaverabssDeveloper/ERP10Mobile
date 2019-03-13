import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIPES } from './pipes';
import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        TranslateModule
    ],
    declarations: [PIPES, COMPONENTS],
    exports: [PIPES, COMPONENTS],
    entryComponents: [ENTRY_COMPONENTS]
})
export class SharedModule {
}

// +info: https://medium.com/frontend-fun/angular-4-shared-modules-18ac50f24852
