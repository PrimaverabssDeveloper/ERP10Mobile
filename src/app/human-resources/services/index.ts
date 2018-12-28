
import { Provider } from '@angular/core';
import { AuthenticationService, InstanceHttpRequestService, DomService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { HumanResourcesService } from './human-resources.service';
import { HumanResourcesDemoService } from './human-resources.demo.service';

export * from './human-resources.service';

export const SERVICES = [
];

export const HumanResourcesServiceProvider: Provider = {
    provide: HumanResourcesService,
    useFactory: (
        http: HttpClient,
        authService: AuthenticationService,
        instanceHttpRequestService: InstanceHttpRequestService,
        domService: DomService
    ) => {
        if (authService.isAuthenticateAsDemo) {
            return new HumanResourcesDemoService(instanceHttpRequestService, domService, http);
        } else {
            return new HumanResourcesService(instanceHttpRequestService, domService);
        }
    },
    deps: [
        HttpClient,
        AuthenticationService,
        InstanceHttpRequestService,
        DomService],
};
