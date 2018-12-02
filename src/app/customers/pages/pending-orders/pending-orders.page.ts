import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Document, PendingOrders, FinantialDocumentPageConfiguration } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { MoneyValue, LocalizedString } from '../../../core/entities';

@Component({
    templateUrl: './pending-orders.page.html',
    styleUrls: ['./pending-orders.page.scss'],
    providers: [CustomersServiceProvider]
})
export class PendingOrdersPage extends PageBase implements OnInit {

    pendingOrders: PendingOrders;

    constructor(
        public loadingController: LoadingController,
        private customersService: CustomersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(loadingController);
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
            this.pendingOrders = await this.customersService.getPendingOrders(companyKey, customerKey);
        } catch (error) {
            console.log(error);
        }

        await this.hideLoading();
    }

    async showDocumentDetailAction(document: Document) {
        const commands = ['customers/customer', 'finantialdocument'];

        const configuration: FinantialDocumentPageConfiguration = {
            documentHeader: {
                titleKey: 'DocumentName|DocumentNumber',
                dateKey: 'DocumentDate',
                valueKey: 'DocumentTotalValue'
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
                rightValueKey: 'DeliveredQuantity'
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
}
