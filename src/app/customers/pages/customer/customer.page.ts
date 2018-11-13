import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute } from '@angular/router';

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
        private route: ActivatedRoute
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
}
