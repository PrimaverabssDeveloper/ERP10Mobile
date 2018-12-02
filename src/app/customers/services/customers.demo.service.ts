import { CustomersService } from './customers.service';
import { Injectable } from '@angular/core';
import { Customer, CustomersSearchResult, PendingOrders, RecentActivity, CurrentAccount } from '../entities';
import { HttpClient } from '@angular/common/http';
import { CustomersStorageService } from './customers-storage.service';

@Injectable()
export class CustomersDemoService extends CustomersService {

    constructor(private http: HttpClient, protected storageService: CustomersStorageService) {
        super(storageService);
    }

    searchCustomers(searchTerm: string): Promise<CustomersSearchResult> {

        // return empty result
        if (!searchTerm || searchTerm.trim().length === 0) {
            return new Promise<CustomersSearchResult>(result => {
                result({hasMore: false, customers: []});
            });
        }

        return this.getDemoDataWithFileName<CustomersSearchResult>('customers_list_10.json');
    }

    getCustomer(companyKey: string, customerKey: string): Promise<Customer> {
        return this.getDemoDataWithFileName<Customer>('customer_PT.json');
    }

    async getPendingOrders(companyKey: string, customerKey: string): Promise<PendingOrders> {
        return this.getDemoDataWithFileName<PendingOrders>('pending_orders.json');
    }

    async getRecentActivity(companyKey: string, customerKey: string): Promise<RecentActivity> {
        return this.getDemoDataWithFileName<RecentActivity>('recent_activity.json');
    }

    async getCurrentAccount(companyKey: string, customerKey: string): Promise<CurrentAccount> {
        return this.getDemoDataWithFileName<CurrentAccount>('current_account.json');
    }

    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/customers/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }
}
