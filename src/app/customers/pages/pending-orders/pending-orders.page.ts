import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './pending-orders.page.html',
    styleUrls: ['./pending-orders.page.scss'],
    providers: [CustomersServiceProvider]
})
export class PendingOrdersPage extends PageBase implements OnInit {

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

        // await this.showLoading();

        // try {
        //     this.customer = await this.customersService.getCustomer(companyKey, customerKey);
        // } catch (error) {
        //     console.log(error);
        // }

        // await this.hideLoading();
    }

    async showDocumentDetailAction() {
        const commands = ['customers/customer', 'finantialdocument'];

        const extras = {
            // queryParams: {
            //     addresses: JSON.stringify(this.customer.contacts.otherAddresses),
            //     customerName: this.customer.name
            // }
        };

        this.router.navigate(commands, extras);
    }
}
