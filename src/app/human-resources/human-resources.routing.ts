import { RouterModule, Routes } from '@angular/router';
import { HrHomePage } from './pages/hr-home/hr-home.page';

const routes: Routes = [
    {
      path: '',
      component: HrHomePage
    }
];

export const HR_ROUTING = RouterModule.forChild(routes);
