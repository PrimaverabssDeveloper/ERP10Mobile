import { RouterModule, Routes } from '@angular/router';
import { HomePage, SettingsPage } from './pages';

const salesRoutes: Routes = [
    {
      path: '',
      children: [
          {
              path: '',
              redirectTo: 'home',
              pathMatch: 'full'
          },
          {
              path: 'home',
              component: HomePage
          },
          {
              path: 'settings',
              component: SettingsPage
          }
        ]
    }
];

export const SALES_ROUTING = RouterModule.forChild(salesRoutes);
