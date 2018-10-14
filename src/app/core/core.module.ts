import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PAGES } from './pages';
import { COMPONENTS } from './components';
import { ROUTING } from './core.routes';
import { SERVICES } from './services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ROUTING
  ],
  declarations: [PAGES, COMPONENTS],
  providers: [SERVICES],
  entryComponents: []
})
export class CoreModule {}
