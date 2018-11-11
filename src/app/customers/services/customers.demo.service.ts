import { CustomersService } from './customers.service';
import { Injectable } from '@angular/core';
import { Customer, CustomersSearchResult } from '../entities';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CustomersDemoService extends CustomersService {

    constructor(private http: HttpClient) {
        super();
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

    private getDemoDataWithFileName<T>(fileName: string): Promise<T> {
        const path = `../assets/customers/demo-data/${fileName}`;
        return this.http.get<T>(path).toPromise();
    }
}
