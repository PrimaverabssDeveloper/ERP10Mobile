import { RouterModule, Routes } from '@angular/router';
import { DashboardPage, InstancesPage } from './pages';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/instances',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardPage
    },
    {
        path: 'instances',
        component: InstancesPage
    }
];

export const ROUTING = RouterModule.forChild(routes);
