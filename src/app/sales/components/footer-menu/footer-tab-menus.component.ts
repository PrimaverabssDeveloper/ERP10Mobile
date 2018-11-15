import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'footer-tab-menus',
    templateUrl: './footer-tab-menus.component.html',
    styleUrls: ['./footer-tab-menus.component.scss']
})
export class FooterTabMenuComponent {

    @Input() menus: FooterTabMenu[];
    @Output() menuItemSelected = new EventEmitter<FooterMenuItemSelectedEvent>();

    menuClosed: boolean;

    selectedMenu: FooterTabMenu;

    /**
     *
     */
    constructor() {
        this.menuClosed = true;
    }

    getMenuItemComputedStyle(): any {
        if (!this.menus || this.menus.length === 0) {
            return {};
        }

        const width = 100 / this.menus.length;

        return {
            width: `${width}%`
        };
    }

    getMenuArrowComputedStyle(): any {

        if (!this.menus || this.menus.length === 0) {
            return {};
        }

        const index = this.menus.indexOf(this.selectedMenu);
        const menuItemWidthPercentage = 100 / this.menus.length;

        const percentagePositon = menuItemWidthPercentage * index + menuItemWidthPercentage * .5;

        return {
            left: `calc(${percentagePositon}% - 10px)`
        };
    }

    menuSelectedAction(menu: FooterTabMenu) {

        if (this.selectedMenu === menu) {
            this.toogleCloseOpenMenu();
        } else if (this.menuClosed) {
            this.openMenu();
        }

        this.selectedMenu = menu;
    }

    menuItemSelectedAction(menu: FooterTabMenu, menuItem: FooterTabMenuItem) {
        this.selectedMenu = menu;
        this.closeMenu();
        this.menuItemSelected.emit({ menu: menu, menuItem: menuItem});
    }

    private closeMenu() {
        this.menuClosed = true;
    }

    private openMenu() {
        this.menuClosed = false;
    }

    private toogleCloseOpenMenu() {
        this.menuClosed = !this.menuClosed;
    }
}

export interface FooterTabMenu {
    key: string;
    icon: string;
    items: FooterTabMenuItem[];
}

export interface FooterTabMenuItem {
    key: string;
    label: string;
    selected?: boolean;
}

export interface FooterMenuItemSelectedEvent {
    menu: FooterTabMenu;
    menuItem: FooterTabMenuItem;
}
