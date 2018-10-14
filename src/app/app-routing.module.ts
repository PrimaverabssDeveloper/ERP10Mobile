import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'core', pathMatch: 'full' },
  { path: 'core', loadChildren: './core/core.module#CoreModule' },
  { path: 'sales', loadChildren: './sales/sales.module#SalesModule' },
  { path: 'hr', loadChildren: './human-resources/human-resources.module#HumanResourcesModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
