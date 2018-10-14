import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PAGES } from './pages';
import { COMPONENTS } from './components';

import { HR_ROUTING } from './human-resources.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HR_ROUTING
  ],
  declarations: [PAGES, COMPONENTS]
})
export class HumanResourcesModule {}
