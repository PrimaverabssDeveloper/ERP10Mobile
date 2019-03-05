import { AuthenticationService } from './authentication.service';
import { HttpRequestService } from './http-request.service';
import { InstanceHttpRequestService } from './instance-http-requests.service';
import { CoreStorageService } from './core-storage.service';
import { DomService } from './dom.service';
import { ModulesService } from './modules.service';
import { LocaleService } from './locale.service';
import { StorageService } from './storage/storage.service';
import { HttpRequestInterceptorService } from './http-request-interceptor.service';
import { InstanceService } from './instance.service';

export * from './authentication.service';
export * from './instance.service';
export * from './http-request.service';
export * from './instance-http-requests.service';
export * from './core-storage.service';
export * from './dom.service';
export * from './modules.service';
export * from './locale.service';
export * from './storage/module-storage.service.base';
export * from './storage/storage.service';
export * from './http-request-interceptor.service';

export const SERVICES = [
    AuthenticationService,
    InstanceService,
    HttpRequestService,
    InstanceHttpRequestService,
    CoreStorageService,
    DomService,
    ModulesService,
    LocaleService,
    StorageService,
    HttpRequestInterceptorService
];


