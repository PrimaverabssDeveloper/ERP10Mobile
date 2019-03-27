import { RouterModule, Routes } from '@angular/router';
import { HrSettingsPage, HrHomePage } from './pages';

const routes: Routes = [
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
                component: HrHomePage
            },
            {
                path: 'settings',
                component: HrSettingsPage
            }
        ]
    }
];

export const HR_ROUTING = RouterModule.forChild(routes);
