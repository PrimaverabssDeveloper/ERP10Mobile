import { RouterModule, Routes } from '@angular/router';
import { DashboardPage, InstancesPage, SettingsPage, LanguagePage } from './pages';

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
    },
    {
        path: 'settings',
        component: SettingsPage
    },
    {
        path: 'language',
        component: LanguagePage
    }
];

export const ROUTING = RouterModule.forChild(routes);
