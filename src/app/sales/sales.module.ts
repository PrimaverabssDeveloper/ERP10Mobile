import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { PAGES } from './pages';
import { SALES_ROUTING } from './sales.routes';
import { ENTRY_COMPONENTS } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SALES_ROUTING
  ],
  declarations: [PAGES, ENTRY_COMPONENTS],
  entryComponents: [ENTRY_COMPONENTS]
})
export class SalesModule {}
