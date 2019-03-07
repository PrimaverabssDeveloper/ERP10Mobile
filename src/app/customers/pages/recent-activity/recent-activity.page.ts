import { PageBase } from '../../../shared/pages';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer, RecentActivity, FinantialDocumentPageConfiguration } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './recent-activity.page.html',
    styleUrls: ['./recent-activity.page.scss'],
    providers: [CustomersServiceProvider]
})
export class RecentActivityPage extends PageBase implements OnInit {

    recentActivity: RecentActivity;

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        private customersService: CustomersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(loadingController, location);
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
            this.recentActivity = await this.customersService.getRecentActivity(companyKey, customerKey);
        } catch (error) {
            console.log(error);
        }

        await this.hideLoading();
    }

    async showInvoicesDetailAction(document: Document) {
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

    async showOrdersDetailAction(document: Document) {
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

    async showPaymentsDetailAction(document: Document) {
        const commands = ['customers/customer', 'finantialdocument'];

        const configuration: FinantialDocumentPageConfiguration = {
            documentHeader: {
                titleKey: 'DocumentName|DocumentNumber',
                dateKey: 'DocumentDate',
                valueKey: 'DocumentTotalValue'
            },
            documentHeaderListKeys: [
                'DocumentDescription',
                'DocumentEntity',
                'DocumentPaymentType'
            ],
            documentLines: {
                titleKey: 'LineDescription',
                leftValueKey: 'OriginalValue',
                rightValueKey: 'PaidValue'
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
