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
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpRequestInterceptorService implements HttpInterceptor {

    constructor(
        private authentication: AuthenticationService,
        private router: Router,
        private alertController: AlertController,
        private translate: TranslateService
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
                            switch (err.status) {
                                case 401:
                                    // redirect to the login route
                                    // If the router was used to navigate, the app page stack was not clean
                                    window.location.href = '/shell/authentication?logout=true';
                                    break;
                                default:
                                    this.show500Error();
                                    break;
                            }
                        }
                    }
                )
            );
    }

    private async show500Error() {
        const errorMessage = await this.translate.get('CORE.NETWORK_ERROR_MESSAGE').toPromise();
        const okButton = await this.translate.get('SHARED.ALERTS.OK').toPromise();
        const alert = await this.alertController.create({
            message: errorMessage,
            buttons: [okButton]
        });

        await alert.present();
    }
}
