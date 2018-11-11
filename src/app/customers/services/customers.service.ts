import { Injectable } from '@angular/core';
import { CustomersSearchResult, Customer } from '../entities';

@Injectable()
export class CustomersService {

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
}
