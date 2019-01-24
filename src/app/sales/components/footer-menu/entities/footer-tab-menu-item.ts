
/**
 * The configuration for an item of the FooterTabMenu.
 *
 * @export
 * @interface FooterTabMenuItem
 */
export interface FooterTabMenuItem {

    /**
     * The item unique key.
     *
     * @type {string}
     * @memberof FooterTabMenuItem
     */
    key: string;

    /**
     * The item text label.
     *
     * @type {string}
     * @memberof FooterTabMenuItem
     */
    label: string;

    /**
     * option function that defines if the items is currently selected.
     *
     * @memberof FooterTabMenuItem
     */
    selected?: () => boolean;
}
