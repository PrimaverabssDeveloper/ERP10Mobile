import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages';

const routes: Routes = [
    {
      path: '',
      component: HomePage
    }
];

export const ROUTING = RouterModule.forChild(routes);
