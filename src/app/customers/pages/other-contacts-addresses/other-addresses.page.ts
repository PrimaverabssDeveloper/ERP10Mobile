import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerOtherAddress } from '../../entities';
import { Location } from '@angular/common';

@Component({
    templateUrl: './other-addresses.page.html',
    styleUrls: ['./other-contacts-addresses.page.scss'],
})
export class OtherAddressesPage extends PageBase implements OnInit {

    addresses: CustomerOtherAddress[];
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
        const addressesJson = this.route.snapshot.queryParams['addresses'];
        this.addresses = JSON.parse(addressesJson);

        this.customerName = this.route.snapshot.queryParams['customerName'];
    }

    /**
     * Show the address on the default map provider
     *
     * @param {CustomerOtherAddress} otherAddress
     * @memberof OtherAddressesPage
     */
    async showAddressOnMapAction(otherAddress: CustomerOtherAddress) {
        const address = `${otherAddress.address}+${otherAddress.address2}+${otherAddress.location}`;
        const url = `https://www.google.com/maps/search/?api=1&query=${escape(address)}`;
        window.open(url, '_system');
    }

    /**
     * Create the address based on the provided address parts.
     *
     * @param {CustomerOtherAddress} otherAddress
     * @returns {string}
     * @memberof OtherAddressesPage
     */
    buildAddress(otherAddress: CustomerOtherAddress): string {

        const address = this.getStringOrEmpty(otherAddress.address);
        const address2 = this.getStringOrEmpty(otherAddress.address2);
        const postalCode = this.getStringOrEmpty(otherAddress.postalCode);
        const postalLocation = this.getStringOrEmpty(otherAddress.postalLocation);
        const location = this.getStringOrEmpty(otherAddress.location);
        const contry = this.getStringOrEmpty(otherAddress.country);

        let fullAddress = `${address} ${address2}, ${postalCode} ${postalLocation}, ${location}, ${contry}`;

        let isSanitized = false;
        while (!isSanitized) {
            isSanitized = true;
            fullAddress = fullAddress.trim();

            if (fullAddress[0] === ',') {
                fullAddress = fullAddress.slice(1, fullAddress.length);
                isSanitized = false;
            }

            if (fullAddress[fullAddress.length - 1] === ',') {
                fullAddress = fullAddress.slice(0, fullAddress.length - 1);
                isSanitized = false;
            }
        }

        return fullAddress;
    }

    private getStringOrEmpty(value: string) {
        return value ? value : '';
    }
}
