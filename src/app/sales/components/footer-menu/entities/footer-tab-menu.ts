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
     * The icon path.
     *
     * @type {string}
     * @memberof FooterTabMenu
     */
    icon: string;

    /**
     * The icon path when the menu is disabled.
     *
     * @type {string}
     * @memberof FooterTabMenu
     */
    disabledIcon?: string;

    /**
     * The menu items collection.
     *
     * @type {FooterTabMenuItem[]}
     * @memberof FooterTabMenu
     */
    items: FooterTabMenuItem[];
}
