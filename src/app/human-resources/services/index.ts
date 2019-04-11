
import { Provider } from '@angular/core';
import { AuthenticationService, InstanceHttpRequestService, DomService, InstanceService, ModulesService } from '../../core/services';
import { HttpClient } from '@angular/common/http';
import { HumanResourcesService } from './human-resources.service';
import { HumanResourcesDemoService } from './human-resources.demo.service';
import { PinService } from './pin.service';

export * from './human-resources.service';

export const SERVICES = [
    PinService
];

export const HumanResourcesServiceFactory = (
    http: HttpClient,
    authService: AuthenticationService,
    instanceHttpRequestService: InstanceHttpRequestService,
    instanceService: InstanceService,
    domService: DomService,
    modulesService: ModulesService) => {
    if (authService.isAuthenticateAsDemo) {
        return new HumanResourcesDemoService(instanceHttpRequestService, domService, instanceService, modulesService, http);
    } else {
        return new HumanResourcesService(instanceHttpRequestService, domService, instanceService, modulesService);
    }
};

export const HumanResourcesServiceProvider: Provider = {
    provide: HumanResourcesService,
    useFactory: HumanResourcesServiceFactory,
    deps: [
        HttpClient,
        AuthenticationService,
        InstanceHttpRequestService,
        InstanceService,
        DomService,
        ModulesService
    ],
};
