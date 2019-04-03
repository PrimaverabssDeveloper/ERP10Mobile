import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageBase } from '../../../shared/pages';
import { LoadingController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './customers-list.page.html',
    styleUrls: ['./customers-list.page.scss', '../../styles/common.scss'],
    providers: [CustomersServiceProvider]
})
export class CustomersListPage extends PageBase implements OnInit {
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
    hasMoreSearchResults: boolean;
    searchMessage: string;

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        public menuController: MenuController,
        private customersService: CustomersService,
        private router: Router,
        private translate: TranslateService
    ) {
        super(loadingController, location, menuController);

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

        this.searchMessage = await this.translate.get('CUSTOMERS.CUSTOMERS_LIST_PAGE.MESSAGE_NO_SEARCH_PERFORMED').toPromise();

        await this.showLoading();
        await this.updateRecentCustomersList();
        this.hideLoading();
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

    onSearchUpdate(event: KeyboardEvent, value: string) {
        if (event.which === 13) { // ENTER KEY
            this.searchCustomers(value);
        }
    }

    // #region 'Protected Methods'

    protected getMenuId(): string {
        return 'customers-customers-list-page-menu';
    }

    // #endregion

    private async searchCustomers(searchTerm: string, pageIndex: number = 0, pageSize: number = 10) {

        if (!searchTerm.trim()) { // empty search
            this.searchedCustomers = [];
            this.hasMoreSearchResults = false;
            this.searchMessage = await this.translate.get('CUSTOMERS.CUSTOMERS_LIST_PAGE.MESSAGE_NO_SEARCH_PERFORMED').toPromise();
            return;
        }

        await this.showLoading();

        const result = await this.customersService
                                 .searchCustomers(searchTerm, pageIndex, pageSize);

        if (!result || !result.results || result.results.length === 0) {
            this.searchMessage = await this.translate.get('CUSTOMERS.CUSTOMERS_LIST_PAGE.MESSAGE_SEARCH_NO_RESULTS').toPromise();
        } else {
            this.searchedCustomers = result.results;
            this.hasMoreSearchResults = result.hasMore;
        }

        await this.hideLoading();
    }

    private async addCustomerToRecentList(customer: Customer) {
        await this.customersService.addToRecentViewedCustomers(customer);
    }

    private async updateRecentCustomersList() {
        this.recentViewedCustomers = await this.customersService.getRecentViewedCustomers();
    }
}
