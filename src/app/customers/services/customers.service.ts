import { Injectable } from '@angular/core';
import { CustomersSearchResult, Customer, PendingOrders, RecentActivity, CurrentAccount } from '../entities';
import { CustomersStorageService } from './customers-storage.service';

@Injectable()
export class CustomersService {

    private static readonly RECENT_VIEWED_CUSTOMERS_STORAGE_KEY = 'RECENT_VIEWD_CUSTOMERS_STORAGE_KEY';

    constructor(protected storageService: CustomersStorageService) {
    }

    searchCustomers(searchTerm: string): Promise<CustomersSearchResult> {
        return new Promise<CustomersSearchResult>(result => {
            result(null);
        });
    }

    getCustomer(companyKey: string, customerKey: string): Promise<Customer> {
        return new Promise<Customer>(result => {
            result(null);
        });
    }

    async getRecentViewedCustomers(): Promise<Customer[]> {
        const result = await this.storageService
                                 .getData<Customer[]>(CustomersService.RECENT_VIEWED_CUSTOMERS_STORAGE_KEY, true);
        if (result) {
            return result;
        } else {
            return [];
        }
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
