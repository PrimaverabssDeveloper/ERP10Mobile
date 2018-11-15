import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIPES } from './pipes';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PIPES],
    exports: [PIPES]
})
export class SharedModule {
}

// +info: https://medium.com/frontend-fun/angular-4-shared-modules-18ac50f24852
