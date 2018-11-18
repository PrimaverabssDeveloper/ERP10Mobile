import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './customer.page.html',
    styleUrls: ['./customer.page.scss'],
    providers: [CustomersServiceProvider]
})
export class CustomerPage extends PageBase implements OnInit {

    customer: Customer;
    currentYear: number;
    previousYear: number;

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
}
