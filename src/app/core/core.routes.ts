import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages';
import { InstanceSelectorPage } from './pages/instance-selector/instance-selector.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/instances',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePage
    },
    {
        path: 'instances',
        component: InstanceSelectorPage
    }
];

export const ROUTING = RouterModule.forChild(routes);
