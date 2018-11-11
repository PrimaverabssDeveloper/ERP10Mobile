import { LoadingController } from '@ionic/angular';

/**
 * The base class for all pages.
 *
 * @export
 * @abstract
 * @class BasePage
 */
export abstract class PageBase {

    // #region 'Private Properties'

    loading: HTMLIonLoadingElement;

    // #endregion

    // #region 'Constructor'

    constructor(public loadingController: LoadingController) {

    }

    // #endregion

    // #region 'Protected Methods'

    /**
     * Show's loading.
     *
     * @protected
     * @returns Promise
     * @memberof BasePage
     */
    protected async showLoading(): Promise<void> {
        if (this.loading) {
            return;
        }

        this.loading = await this.loadingController.create();

        return await this.loading.present();
    }

    /**
     * Dismiss Loading.
     *
     * @protected
     * @returns Promise
     * @memberof BasePage
     */
    protected async hideLoading(): Promise<void> {

        return await new Promise<void>((resolve) => {
            if (!this.loading) {
                resolve();
                return;
            }

            this.loading
                .dismiss()
                .then(() => {
                    this.loading = null;
                    resolve();
                });
        });
    }

    // #endregion
}
