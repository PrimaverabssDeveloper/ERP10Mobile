import { Component, OnInit } from '@angular/core';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    templateUrl: './customers-list.page.html',
    styleUrls: ['./customers-list.page.scss'],
    providers: [CustomersServiceProvider]
})
export class CustomersListPage extends PageBase implements OnInit {

    private searchUpdated = new Subject<string>();

    customers: Customer[];
    state: 'recent' | 'search';
    recentOrder: 'asc' | 'desc';
    searchOrder: 'asc' | 'desc';

    constructor(
        public loadingController: LoadingController,
        private customersService: CustomersService,
        private router: Router
    ) {
        super(loadingController);

        this.state = 'recent';
        this.recentOrder = 'asc';
        this.searchOrder = 'asc';
    }

    /**
    * Execute on page initialization.
    *
    * @memberof CostumersListPage
    */
    ngOnInit(): void {

        this.searchUpdated
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(st => this.searchCustomers(st));
    }

    recentOptionAction() {
        if (this.state === 'recent') {
            this.recentOrder = this.recentOrder === 'asc' ? 'desc' : 'asc';

        } else {
            this.state = 'recent';
        }
    }

    searchOptionAction() {
        if (this.state === 'search') {
            this.searchOrder = this.searchOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.state = 'search';
        }
    }

    customerAction(customer: Customer) {
        if (!customer) {
            return;
        }

        this.router.navigate(['customers/customer', customer.companyKey, customer.key]);
    }

    onSearchUpdate(searchTerm: string) {
        this.searchUpdated.next(searchTerm);
    }

    private async searchCustomers(searchTerm: string) {
        await this.showLoading();
        this.customersService
            .searchCustomers(searchTerm)
            .then(result => {
                this.customers = result.customers;
                this.hideLoading();
            });
    }
}
