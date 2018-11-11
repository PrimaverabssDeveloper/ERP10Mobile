import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'shell', pathMatch: 'full' },
  { path: 'shell', loadChildren: './shell/shell.module#ShellModule' },
  { path: 'sales', loadChildren: './sales/sales.module#SalesModule' },
  { path: 'humanresources', loadChildren: './human-resources/human-resources.module#HumanResourcesModule' },
  { path: 'customers', loadChildren: './customers/customers.module#CustomersModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
