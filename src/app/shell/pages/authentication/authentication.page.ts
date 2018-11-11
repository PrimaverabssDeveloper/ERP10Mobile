import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services';
import { Router } from '@angular/router';

@Component({
    templateUrl: './authentication.page.html',
    styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage implements OnInit {


    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
    }

    /**
    * Execute on page initialization.
    *
    * @memberof AuthenticationPage
    */
    async ngOnInit() {
        const isAuthenticated = await this.authenticationService.isAuthenticate();

        if (isAuthenticated) {
            this.router.navigate(['/shell/instances']);
        }
    }

    async loginAction() {
        const isAuthenticated = await this.authenticationService.authenticate();
        if (isAuthenticated) {
            this.router.navigate(['/shell/instances']);
        }
    }

    async demoAction() {
        this.authenticationService.authenticateAsDemo();
        this.router.navigate(['/shell/instances']);
    }
}
