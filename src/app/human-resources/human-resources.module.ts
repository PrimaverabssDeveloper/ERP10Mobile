import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { COMPONENTS, ENTRY_COMPONENTS } from './components';

import { HR_ROUTING } from './human-resources.routing';
import { SharedModule } from '../shared/shared.module';
import { ModulesService } from '../core/services';
import { ModuleDefinition } from '../core/entities';
import { TranslateModule } from '@ngx-translate/core';
import { HrModuleDefinition } from './module-definition';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        SharedModule,
        HR_ROUTING
    ],
    declarations: [PAGES, COMPONENTS],
    entryComponents: [ENTRY_COMPONENTS]
})
export class HumanResourcesModule {
    constructor(
        private modulesService: ModulesService,
    ) {
        this.modulesService.addModuleDefinition(HrModuleDefinition);
    }
}
