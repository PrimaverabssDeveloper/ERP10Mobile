import { SideMenuComponent } from './side-menu/side-menu.component';
import { DrawerComponent } from './drawer/drawer.component';
import { PopoverSelectorComponent } from './popover-selector/popover-selector.component';

export * from './side-menu/side-menu.component';
export * from './drawer/drawer.component';
export * from './popover-selector/popover-selector.component';

export const COMPONENTS = [
    SideMenuComponent,
    DrawerComponent,
    PopoverSelectorComponent
];

export const ENTRY_COMPONENTS = [
    PopoverSelectorComponent
];
