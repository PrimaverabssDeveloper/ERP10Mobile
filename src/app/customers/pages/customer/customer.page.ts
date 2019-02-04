import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer, CustomerSales } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { MathTools } from '../../../shared/tools';

@Component({
    templateUrl: './customer.page.html',
    styleUrls: ['./customer.page.scss'],
    providers: [CustomersServiceProvider]
})
export class CustomerPage extends PageBase implements OnInit {

    customer: Customer;
    currentYear: number;
    previousYear: number;
    salesPercentageVariation: number;

    constructor(
        public loadingController: LoadingController,
        private customersService: CustomersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(loadingController);
        const date = new Date();
        this.currentYear = date.getFullYear();
        this.previousYear = date.getFullYear() - 1;
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
            this.customer = await this.customersService.getCustomer(companyKey, customerKey);

            // calc the variation between previouse and current sales
            this.salesPercentageVariation = MathTools.variationBetweenTwoNumbers(
                this.customer.sales.totalSales.previousSales,
                this.customer.sales.totalSales.currentSales,
                true);

        } catch (error) {
            console.log(error);
        }

        await this.hideLoading();
    }

    async otherContactsAction() {
        const commands = ['customers/customer', this.customer.companyKey, this.customer.key, 'othercontacts'];

        const extras = {
            queryParams: {
                contacts: JSON.stringify(this.customer.contacts.otherContacts),
                customerName: this.customer.name
            }
        };

        this.router.navigate(commands, extras);
    }

    async otherAddressesAction() {
        const commands = ['customers/customer', this.customer.companyKey, this.customer.key, 'otheraddresses'];

        const extras = {
            queryParams: {
                addresses: JSON.stringify(this.customer.contacts.otherAddresses),
                customerName: this.customer.name
            }
        };

        this.router.navigate(commands, extras);
    }

    async pendingOrdersAction() {
        const commands = ['customers/customer', this.customer.companyKey, this.customer.key, 'pendingorders'];

        const extras = {
            // queryParams: {
            //     addresses: JSON.stringify(this.customer.contacts.otherAddresses),
            //     customerName: this.customer.name
            // }
        };

        this.router.navigate(commands, extras);
    }

    async currentAccountAction() {
        const commands = ['customers/customer', this.customer.companyKey, this.customer.key, 'currentaccount'];

        const extras = {
            // queryParams: {
            //     addresses: JSON.stringify(this.customer.contacts.otherAddresses),
            //     customerName: this.customer.name
            // }
        };

        this.router.navigate(commands, extras);
    }

    async recentActivityAction() {
        const commands = ['customers/customer', this.customer.companyKey, this.customer.key, 'recentactivity'];

        const extras = {
            // queryParams: {
            //     addresses: JSON.stringify(this.customer.contacts.otherAddresses),
            //     customerName: this.customer.name
            // }
        };

        this.router.navigate(commands, extras);
    }
}
