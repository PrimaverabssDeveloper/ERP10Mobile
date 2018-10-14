import { Component } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private router: Router) {
    }

    openSalesModule() {
        this.router.navigate(['/sales']);
    }

    openHrModule() {

    }

    openClientsModule() {

    }
}
