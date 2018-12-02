import { Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomersDemoService } from './customers.demo.service';
import { AuthenticationService, InstancesService } from '../../core/services';
import { CustomersService } from './customers.service';
import { CustomersStorageService } from './customers-storage.service';
import { DocumentValueService } from './document-value.service';

export * from './customers.demo.service';
export * from './customers.service';
export * from './customers-storage.service';
export * from './document-value.service';

// only add modules that are global to the module
export const MODULE_SERVICES = [
    CustomersStorageService,
    DocumentValueService
];

export const CustomersServiceProvider: Provider = {
    provide: CustomersService,
    useFactory: (
        http: HttpClient,
        authService: AuthenticationService,
        storageService: CustomersStorageService
    ) => {
        if (authService.isAuthenticateAsDemo) {
            return new CustomersDemoService(http, storageService);
        } else {
            return new CustomersService(storageService);
        }
    },
    deps: [HttpClient, AuthenticationService, CustomersStorageService, InstancesService],
};

