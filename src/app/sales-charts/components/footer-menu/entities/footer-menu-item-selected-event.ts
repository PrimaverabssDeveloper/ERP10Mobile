
import { FooterTabMenu } from './footer-tab-menu';
import { FooterTabMenuItem } from './footer-tab-menu-item';

/**
 * The data provided on the event that is fired
 * when an menu items is selected.
 *
 * @export
 * @interface FooterMenuItemSelectedEvent
 */
export interface FooterMenuItemSelectedEvent {
    /**
     * The footer tab menu that the selected item belongs.
     *
     * @type {FooterTabMenu}
     * @memberof FooterMenuItemSelectedEvent
     */
    menu: FooterTabMenu;

    /**
     * The selected footer tab menu item.
     *
     * @type {FooterTabMenuItem}
     * @memberof FooterMenuItemSelectedEvent
     */
    menuItem: FooterTabMenuItem;
}
