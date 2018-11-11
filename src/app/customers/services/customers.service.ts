import { Injectable } from '@angular/core';
import { CustomersSearchResult } from '../entities';

@Injectable()
export class CustomersService {

    searchCustomers(searchTerm: string): Promise<CustomersSearchResult> {
        return new Promise<CustomersSearchResult>(result => {
            result(null);
        });
    }
}
