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
    private searchedCustomers: Customer[];
    private recentViewedCustomers: Customer[];

    get customers(): Customer[] {
        if (this.state === 'recent') {
            return this.recentOrder === 'asc' ? this.recentViewedCustomers : this.recentViewedCustomers.reverse();
        } else {
            return this.searchedCustomers;
        }
    }

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
    async ngOnInit() {
        await this.showLoading();
        await this.updateRecentCustomersList();
        this.hideLoading();

        // perform customers search after 500ms
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

    async customerAction(customer: Customer) {
        if (!customer) {
            return;
        }

        await this.addCustomerToRecentList(customer);
        await this.updateRecentCustomersList();

        this.router.navigate(['customers/customer', customer.companyKey, customer.key]);
    }

    onSearchUpdate(searchTerm: string) {
        this.searchUpdated.next(searchTerm);
    }

    private async searchCustomers(searchTerm: string) {
        // await this.showLoading();

        const result = await this.customersService
                                 .searchCustomers(searchTerm);

        if (result) {
            this.searchedCustomers = result.customers;
        }

        // this.hideLoading();
    }

    private async addCustomerToRecentList(customer: Customer) {
        await this.customersService.addToRecentViewedCustomers(customer);
    }

    private async updateRecentCustomersList() {
        this.recentViewedCustomers = await this.customersService.getRecentViewedCustomers();
    }
}
