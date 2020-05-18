import { CustomersService } from './customers.service';
import { Injectable } from '@angular/core';
import { Customer, CustomersSearchResult, PendingOrders, RecentActivity, CurrentAccount } from '../entities';
import { HttpClient } from '@angular/common/http';
import { CustomersStorageService } from './customers-storage.service';
import { InstanceHttpRequestService } from '../../core/services';
import { CompanySalesData } from '../../sales/entities/sales-charts';
import { ChartBundle } from '../../sales-charts/entities';

@Injectable()
export class CustomersDemoService extends CustomersService {

    constructor(
        private http: HttpClient,
        protected storageService: CustomersStorageService,
        protected instanceHttpRequestService: InstanceHttpRequestService) {
        super(storageService, instanceHttpRequestService);
    }

    async searchCustomers(searchTerm: string, pageIndex: number, pageSize: number): Promise<CustomersSearchResult> {

        // return empty result
        if (!searchTerm || searchTerm.trim().length === 0) {
            return new Promise<CustomersSearchResult>(result => {
                result({ hasMore: false, results: [] });
            });
        }

        var result = await this.getDemoDataWithFileName<CustomersSearchResult>('customers_list_10.json');

        result.results = result.results.
            filter(
                sr => sr.name.toLocaleLowerCase().includes(searchTerm)
                    || sr.key.toLocaleLowerCase().includes(searchTerm)
                    || sr.companyKey.toLocaleLowerCase().includes(searchTerm)
                    )

        return result;
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

    async getSalesCharts(companyKey: string, customerKey: string): Promise<ChartBundle[]> {
        const res = await this.getDemoDataWithFileName<{ data: { chartBundle: ChartBundle[] } }>('sales-charts.json');
        return res.data.chartBundle;
    }


    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/customers/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }
}
