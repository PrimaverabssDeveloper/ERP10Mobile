import { RouterModule, Routes } from '@angular/router';
import { DashboardPage, InstancesPage, SettingsPage, LanguagePage } from './pages';
import { AuthenticationPage } from './pages/authentication/authentication.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/authentication',
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
    },
    {
        path: 'authentication',
        component: AuthenticationPage
    }
];

export const ROUTING = RouterModule.forChild(routes);
