import { Injectable } from '@angular/core';
import { CustomersSearchResult, Customer, PendingOrders, RecentActivity, CurrentAccount } from '../entities';
import { CustomersStorageService } from './customers-storage.service';
import { InstanceHttpRequestService } from '../../core/services';

@Injectable()
export class CustomersService {

    private static readonly RECENT_VIEWED_CUSTOMERS_STORAGE_KEY = 'RECENT_VIEWD_CUSTOMERS_STORAGE_KEY';

    private static readonly SEARCH_CUSTOMERS = (searchTerm) => `customers?searchSrt=${searchTerm}`;

    constructor(
        protected storageService: CustomersStorageService,
        protected instanceHttpRequestService: InstanceHttpRequestService) {
    }

    /**
     * Perform a customers search request.
     *
     * @param {string} searchTerm
     * @returns {Promise<CustomersSearchResult>}
     * @memberof CustomersService
     */
    async searchCustomers(searchTerm: string): Promise<CustomersSearchResult> {

        let result: CustomersSearchResult = null;

        try {
            result = await this.instanceHttpRequestService
                               .get<CustomersSearchResult>(CustomersService.SEARCH_CUSTOMERS(searchTerm));
        } catch (error) {
            console.log(error);
        }

        return result;
    }

    getCustomer(companyKey: string, customerKey: string): Promise<Customer> {
        return new Promise<Customer>(result => {
            result(null);
        });
    }

    async getRecentViewedCustomers(): Promise<Customer[]> {

        let customers: Customer[];

        try {
            customers = await this.storageService
                                  .getData<Customer[]>(CustomersService.RECENT_VIEWED_CUSTOMERS_STORAGE_KEY, true);
        } catch (error) {
            console.error(error);
        }

        return customers;
    }

    async addToRecentViewedCustomers(customer: Customer): Promise<any> {
        const recentViewedCustomers = await this.getRecentViewedCustomers();
        const index = recentViewedCustomers.findIndex(
            c => c.key === customer.key && c.companyKey === customer.companyKey
        );

        // this customer already exist
        // lets remove it, otherwise it will be duplicated
        if (index >= 0) {
            recentViewedCustomers.splice(index, 1);
        }

        recentViewedCustomers.unshift(customer);

        await this.storageService.setData(CustomersService.RECENT_VIEWED_CUSTOMERS_STORAGE_KEY, recentViewedCustomers, true);
    }

    async getPendingOrders(companyKey: string, customerKey: string): Promise<PendingOrders> {
        return null;
    }

    async getRecentActivity(companyKey: string, customerKey: string): Promise<RecentActivity> {
        return null;
    }

    async getCurrentAccount(companyKey: string, customerKey: string): Promise<CurrentAccount> {
        return null;
    }
}
