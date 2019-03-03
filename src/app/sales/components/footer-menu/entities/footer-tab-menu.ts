import { FooterTabMenuItem } from './footer-tab-menu-item';

/**
 * Configuration for an Footer Tab Menu.
 *
 * @export
 * @interface FooterTabMenu
 */
export interface FooterTabMenu {

    /**
     * The unique key.
     *
     * @type {string}
     * @memberof FooterTabMenu
     */
    key: string;

    /**
     * The icon class.
     *
     * @type {string}
     * @memberof FooterTabMenu
     */
    iconClass: string;

    /**
     * The icon class when the menu is disabled.
     *
     * @type {string}
     * @memberof FooterTabMenu
     */
    disabledIconClass?: string;

    /**
     * The menu items collection.
     *
     * @type {FooterTabMenuItem[]}
     * @memberof FooterTabMenu
     */
    items: FooterTabMenuItem[];
}
