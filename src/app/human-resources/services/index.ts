
import { Provider } from '@angular/core';
import { AuthenticationService, InstanceHttpRequestService, DomService, InstanceService } from '../../core/services';
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
        instanceService: InstanceService,
        domService: DomService
    ) => {
        if (authService.isAuthenticateAsDemo) {
            return new HumanResourcesDemoService(instanceHttpRequestService, domService, instanceService, http);
        } else {
            return new HumanResourcesService(instanceHttpRequestService, domService, instanceService);
        }
    },
    deps: [
        HttpClient,
        AuthenticationService,
        InstanceHttpRequestService,
        InstanceService,
        DomService],
};
