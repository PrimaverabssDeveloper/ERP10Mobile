import { PageBase } from '../../../shared/pages';
import { Location } from '@angular/common';
import { LoadingController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer, CurrentAccount, Document, FinantialDocumentPageConfiguration, DocumentValue } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './current-account.page.html',
    styleUrls: ['./current-account.page.scss'],
    providers: [CustomersServiceProvider]
})
export class CurrentAccountPage extends PageBase implements OnInit {

    state: 'older' | 'lastMonth' | 'unexpired';
    currentAccount: CurrentAccount;

    get documents(): Document[] {
        let documents: Document[];
        switch (this.state) {
            case 'older':
                documents = this.currentAccount.expiredSixtyDays.documents;
                break;
            case 'lastMonth':
                documents = this.currentAccount.expiredThirtyDays.documents;
                break;
            case 'unexpired':
                documents = this.currentAccount.unexpired.documents;
                break;
        }

        return documents;
    }

    get rowAccentColor(): string {
        return this.getAccentColor(this.state);
    }

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private customersService: CustomersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(loadingController, location, menuController);
        this.state = 'older';
    }

    /**
    * Execute on page initialization.
    *
    * @memberof CustomerPage
    */
    async ngOnInit() {
        const companyKey = this.route.snapshot.paramMap.get('companyKey');
        const customerKey = this.route.snapshot.paramMap.get('customerKey');

        await this.showLoading();

        try {
            this.currentAccount = await this.customersService.getCurrentAccount(companyKey, customerKey);
        } catch (error) {
            console.log(error);
        }

        if (!this.currentAccount) {
            this.goBack();
        }

        await this.hideLoading();
    }

    async documentLineAction() {
        const commands = ['customers/customer', 'finantialdocumentline'];

        const extras = {
            // queryParams: {
            //     addresses: JSON.stringify(this.customer.contacts.otherAddresses),
            //     customerName: this.customer.name
            // }
        };

        this.router.navigate(commands, extras);
    }

    async changeStateAction(state: 'older' | 'lastMonth' | 'unexpired') {
        this.state = state;
    }

    async showDocumentDetailAction(document: DocumentValue) {
        const commands = ['customers/customer', 'finantialdocument'];

        const configuration: FinantialDocumentPageConfiguration = {
            documentHeader: {
                titleKey: 'DocumentName|DocumentNumber',
                dateKey: 'DocumentDate',
                secondDateKey: 'DocumentDueDate',
                valueKey: 'DocumentTotalValue',
                secondValueKey: 'DocumentPendingValue',
                accentColor: this.getAccentColor(this.state)
            },
            documentHeaderListKeys: [
                'DocumentDescription',
                'DocumentPaymentConditions',
                'DocumentLoadingLocation',
                'DocumentUnloadingLocation',
                'TotalDiscount',
                'DocumentNetValue'
            ],
            documentLines: {
                titleKey: 'LineCode|LineDescription',
                leftValueKey: 'Quantity',
                rightValueKey: 'TotalValue'
            }
        };

        const extras = {
            queryParams: {
                configuration: JSON.stringify(configuration),
                document: JSON.stringify(document),
            }
        };

        this.router.navigate(commands, extras);
    }

    getArrowComputedStyle(): any {

        let index = 0;
        switch (this.state) {
            case 'older':
                index = 0;
                break;
            case 'lastMonth':
                index = 1;
                break;
            case 'unexpired':
                index = 2;
                break;
        }
        const menuItemWidthPercentage = 100 / 3;

        const percentagePositon = menuItemWidthPercentage * index + menuItemWidthPercentage * .5;

        return {
            left: `calc(${percentagePositon}% - 10px)`
        };
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'customers-current-account-page-menu';
    }

    // #endregion

    private getAccentColor(state: string): string {
        let accentColor: string;
        switch (state) {
            case 'older':
                accentColor = '#E53935';
                break;
            case 'lastMonth':
                accentColor = '#E53935';
                break;
            case 'unexpired':
                accentColor = '#00E676';
                break;
        }

        return accentColor;
    }
}
