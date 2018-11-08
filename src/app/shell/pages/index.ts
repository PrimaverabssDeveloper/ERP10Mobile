import { DashboardPage } from './dashboard/dashboard.page';
import { InstancesPage } from './instances/instances.page';
import { SettingsPage } from './settings/settings.page';
import { LanguagePage } from './language/language.page';
import { AuthenticationPage } from './authentication/authentication.page';
import { TickerSettingsPage } from './ticker-settings/ticker-settings.page';

export * from './dashboard/dashboard.page';
export * from './instances/instances.page';
export * from './settings/settings.page';
export * from './language/language.page';
export * from './ticker-settings/ticker-settings.page';

export const PAGES = [
    DashboardPage,
    InstancesPage,
    SettingsPage,
    LanguagePage,
    AuthenticationPage,
    TickerSettingsPage
];
