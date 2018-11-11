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

        return this.getDemoDataWithFileName('clients_list_10.json');
    }

    private getDemoDataWithFileName(fileName: string): Promise<any> {
        const path = `../assets/customers/demo-data/${fileName}`;
        return this.http.get(path).toPromise();
    }
}
