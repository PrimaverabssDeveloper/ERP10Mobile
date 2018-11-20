import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

    constructor(
        private authentication: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.authentication.accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authentication.accessToken}`
                }
            });
        }

        return next
            .handle(request)
            .pipe(
                tap(
                    (event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            // do stuff with response if you want
                        }
                    },
                    (err: any) => {
                        if (err instanceof HttpErrorResponse) {
                            if (err.status === 401) {
                                // redirect to the login route
                                // If the router was used to navigate, the app page stack was not clean
                                window.location.href = '/shell/authentication?logout=true';
                            }
                        }
                    }
                )
            );
    }
}
