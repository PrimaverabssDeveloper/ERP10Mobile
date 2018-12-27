import { AuthenticationService } from './authentication.service';
import { InstancesService } from './instances.service';
import { HttpRequestService } from './http-request.service';
import { InstanceHttpRequestService } from './instance-http-requests.service';
import { CoreStorageService } from './core-storage.service';
import { DomService } from './dom.service';
import { ModulesService } from './modules.service';
import { LocaleService } from './locale.service';
import { StorageService } from './storage/storage.service';
import { TokenInterceptorService } from './token-interceptor.service';

export * from './authentication.service';
export * from './instances.service';
export * from './http-request.service';
export * from './instance-http-requests.service';
export * from './core-storage.service';
export * from './dom.service';
export * from './modules.service';
export * from './locale.service';
export * from './storage/module-storage.service.base';
export * from './storage/storage.service';
export * from './token-interceptor.service';

export const SERVICES = [
    AuthenticationService,
    InstancesService,
    HttpRequestService,
    InstanceHttpRequestService,
    CoreStorageService,
    DomService,
    ModulesService,
    LocaleService,
    StorageService,
    TokenInterceptorService
];


