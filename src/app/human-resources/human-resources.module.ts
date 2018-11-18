import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { COMPONENTS } from './components';

import { HR_ROUTING } from './human-resources.routing';
import { SharedModule } from '../shared/shared.module';

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
export class HumanResourcesModule {}
