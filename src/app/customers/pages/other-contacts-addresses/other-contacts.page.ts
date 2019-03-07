import { PageBase } from '../../../shared/pages';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { CustomerOtherContacts } from '../../entities';

@Component({
    templateUrl: './other-contacts.page.html',
    styleUrls: ['./other-contacts-addresses.page.scss'],
})
export class OtherContactsPage extends PageBase implements OnInit {

    contacts: CustomerOtherContacts[];
    customerName: string;

    constructor(
        public loadingController: LoadingController,
        public location: Location,
        private route: ActivatedRoute
    ) {
        super(loadingController, location);
    }

    /**
    * Execute on page initialization.
    *
    * @memberof OtherContactsPage
    */
    async ngOnInit() {
        const contactsJson = this.route.snapshot.queryParams['contacts'];
        this.contacts = JSON.parse(contactsJson);

        this.customerName = this.route.snapshot.queryParams['customerName'];
    }
}
