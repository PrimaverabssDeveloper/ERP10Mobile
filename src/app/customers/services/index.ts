import { CustomersDemoService } from './customers.demo.service';
import { AuthenticationService } from '../../core/services';
import { CustomersService } from './customers.service';
import { Provider } from '@angular/core';

export * from './customers.demo.service';
export * from './customers.service';

export const CustomersServiceProvider: Provider = {
    provide: CustomersService,
    useFactory: (authService: AuthenticationService) => {
        if (authService.isAuthenticateAsDemo) {
            return new CustomersDemoService();
        } else {
            return new CustomersService();
        }
    },
    deps: [AuthenticationService],
};

