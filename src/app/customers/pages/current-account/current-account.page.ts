import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './current-account.page.html',
    styleUrls: ['./current-account.page.scss'],
    providers: [CustomersServiceProvider]
})
export class CurrentAccountPage extends PageBase implements OnInit {

    state: 'older' | 'lastMonth' | 'unexpired';

    constructor(
        public loadingController: LoadingController,
        private customersService: CustomersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(loadingController);
        this.state = 'older';
    }

    /**
    * Execute on page initialization.
    *
    * @memberof CustomerPage
    */
    async ngOnInit() {
        // const companyKey = this.route.snapshot.paramMap.get('companyKey');
        // const customerKey = this.route.snapshot.paramMap.get('customerKey');

        // await this.showLoading();

        // try {
        //     this.customer = await this.customersService.getCustomer(companyKey, customerKey);
        // } catch (error) {
        //     console.log(error);
        // }

        // await this.hideLoading();
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
}
