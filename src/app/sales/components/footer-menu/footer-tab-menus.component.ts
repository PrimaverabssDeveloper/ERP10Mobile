import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { FooterTabMenu, FooterMenuItemSelectedEvent, FooterTabMenuItem } from './entities';

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
    constructor(private element: ElementRef) {
        this.menuClosed = true;
    }

    /**
     * This event will close the menu if the touch is outside the menu.
     *
     * @param {TouchEvent} e
     * @returns
     * @memberof FooterTabMenuComponent
     */
    @HostListener('document:touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {

        if (this.menuClosed) {
            return;
        }

        let target = e.touches[0].target as any;

        while (target) {
            if (target === this.element.nativeElement) {
                // touched inside drawer. Do nothing.
                return;
            }

            target = target.parentElement;
        }

        this.closeMenu();
    }

    /**
     * Provide the style for the menu tabs.
     *
     * @returns {*}
     * @memberof FooterTabMenuComponent
     */
    getMenuItemComputedStyle(): any {
        if (!this.menus || this.menus.length === 0) {
            return {};
        }

        const width = 100 / this.menus.length;

        return {
            width: `${width}%`
        };
    }

    /**
     * Provides the style for the menu arrow with the correct position
     * based on the current selected menu tab.
     *
     * @returns {*}
     * @memberof FooterTabMenuComponent
     */
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

    /**
     * Provides the menu tab icon class.
     * If the menu has no items, the disabled icon class must be provided.
     *
     * @param {FooterTabMenu} menu
     * @returns
     * @memberof FooterTabMenuComponent
     */
    getMenuIconClass(menu: FooterTabMenu) {
        return menu.items && menu.items.length > 0 ? menu.iconClass : menu.disabledIconClass;
    }

    /**
     * The action fired when an tab menu is touched.
     * This will change the current selected menu if the menu has items to display.
     *
     * @param {FooterTabMenu} menu
     * @returns
     * @memberof FooterTabMenuComponent
     */
    menuSelectedAction(menu: FooterTabMenu) {
        // if the menu has no items, is has nothing to show, so it has no action
        if (!menu.items || menu.items.length === 0) {
            return;
        }

        if (this.selectedMenu === menu) {
            this.toogleCloseOpenMenu();
        } else if (this.menuClosed) {
            this.openMenu();
        }

        this.selectedMenu = menu;
    }

    /**
     * The action fired when an menu row is touched.
     *
     * @param {FooterTabMenu} menu
     * @param {FooterTabMenuItem} menuItem
     * @memberof FooterTabMenuComponent
     */
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
