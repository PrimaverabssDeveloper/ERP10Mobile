import { Injectable } from '@angular/core';
import { CustomersSearchResult, Customer, PendingOrders, RecentActivity, CurrentAccount } from '../entities';
import { CustomersStorageService } from './customers-storage.service';
import { InstanceHttpRequestService } from '../../core/services';

@Injectable()
export class CustomersService {

    private static readonly RECENT_VIEWED_CUSTOMERS_STORAGE_KEY = 'RECENT_VIEWD_CUSTOMERS_STORAGE_KEY';

    // private static readonly SEARCH_CUSTOMERS = (searchTerm) => `customers?searchStr=${searchTerm}`;
    private static readonly SEARCH_CUSTOMERS = (searchTerm) => `customers`;

    private static readonly CUSTOMER_DETAIL = (customerKey, companyKey) => `customers/${customerKey}?companyKey=${companyKey}`;

    private static readonly CUSTOMER_PENDING_ORDERS = (customerKey, companyKey) =>
        `customers/${customerKey}/pendingorders?companyKey=${companyKey}`

    private static readonly CUSTOMER_RECENT_ACTIVITY = (customerKey, companyKey) =>
        `customers/${customerKey}/recentactivity?companyKey=${companyKey}`

    private static readonly CUSTOMER_CURRENT_ACCOUNT = (customerKey, companyKey) =>
        `customers/${customerKey}/currentaccount?companyKey=${companyKey}`

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

    async getCustomer(companyKey: string, customerKey: string): Promise<Customer> {
        let customer: Customer = null;

        try {
            customer = await this.instanceHttpRequestService
                               .get<Customer>(CustomersService.CUSTOMER_DETAIL(customerKey, companyKey));
        } catch (error) {
            console.log(error);
        }

        return customer;
    }

    async getRecentViewedCustomers(): Promise<Customer[]> {

        let customers: Customer[];

        try {
            customers = await this.storageService
                                  .getData<Customer[]>(CustomersService.RECENT_VIEWED_CUSTOMERS_STORAGE_KEY, true);
        } catch (error) {
            console.error(error);
        }

        if (!customers) {
            customers = [];
        }

        return customers;
    }

    async getPendingOrders(companyKey: string, customerKey: string): Promise<PendingOrders> {
        let result: PendingOrders;

        try {
            result = await this.instanceHttpRequestService
                                  .get<PendingOrders>(CustomersService.CUSTOMER_PENDING_ORDERS(customerKey, companyKey));
        } catch (error) {
            console.error(error);
        }

        return result;
    }

    async getRecentActivity(companyKey: string, customerKey: string): Promise<RecentActivity> {
        let result: RecentActivity;

        try {
            result = await this.instanceHttpRequestService
                                  .get<RecentActivity>(CustomersService.CUSTOMER_RECENT_ACTIVITY(customerKey, companyKey));
        } catch (error) {
            console.error(error);
        }

        return result;
    }

    async getCurrentAccount(companyKey: string, customerKey: string): Promise<CurrentAccount> {
        let result: CurrentAccount;

        try {
            result = await this.instanceHttpRequestService
                                  .get<CurrentAccount>(CustomersService.CUSTOMER_CURRENT_ACCOUNT(customerKey, companyKey));
        } catch (error) {
            console.error(error);
        }

        return result;
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
}
