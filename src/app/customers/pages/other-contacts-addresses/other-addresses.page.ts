import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerOtherAddress } from '../../entities';

@Component({
    templateUrl: './other-addresses.page.html',
    styleUrls: ['./other-contacts-addresses.page.scss'],
})
export class OtherAddressesPage extends PageBase implements OnInit {

    addresses: CustomerOtherAddress[];
    customerName: string;

    constructor(
        public loadingController: LoadingController,
        private route: ActivatedRoute
    ) {
        super(loadingController);
    }

    /**
    * Execute on page initialization.
    *
    * @memberof OtherContactsPage
    */
    async ngOnInit() {
        const addressesJson = this.route.snapshot.queryParams['addresses'];
        this.addresses = JSON.parse(addressesJson);

        this.customerName = this.route.snapshot.queryParams['customerName'];
    }
}
