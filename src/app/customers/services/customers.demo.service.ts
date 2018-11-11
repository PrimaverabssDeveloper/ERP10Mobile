import { CustomersService } from './customers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomersDemoService extends CustomersService {

    getFoo(): string {
        return 'CustomersDemoService';
    }
}
