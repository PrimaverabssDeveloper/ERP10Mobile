import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { COMPONENTS } from './components';

import { HR_ROUTING } from './human-resources.routing';
import { SharedModule } from '../shared/shared.module';
import { ModulesService } from '../core/services';
import { ModuleDefinition } from '../core/entities';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        HR_ROUTING
    ],
    declarations: [PAGES, COMPONENTS]
})
export class HumanResourcesModule {
    constructor(
        private modulesService: ModulesService,
    ) {
        const moduleDef: ModuleDefinition = {
            key: 'HUMANRESOURCES',
            moduleRoutePath: '/humanresources',
            iconPath: '../../assets/human-resources/human_resources_logo.svg',
            localizedNameKey: '#HR',
            summaries: {
                hasSummaries: false
            },
            settings: {
                hasSettings: true,
                settingsRoutePath: ''
            }
        };

        this.modulesService.addModuleDefinition(moduleDef);
    }
}
