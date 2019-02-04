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

    /**
     * Show the address on the default map provider
     *
     * @param {CustomerOtherAddress} otherAddress
     * @memberof OtherAddressesPage
     */
    async showAddressOnMapAction(otherAddress: CustomerOtherAddress ) {
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

        let address = `${otherAddress.address}
                        ${otherAddress.address2},
                        ${otherAddress.postalCode}
                        ${otherAddress.postalLocation},
                        ${otherAddress.location},
                        ${otherAddress.country}`;

        // Removes the leading and trailing white space
        address = address.trim();

        // In case of the last chart is a ',', removes it
        if (address[address.length - 1] === ',') {
            address = address.slice(0, address.length - 1);
        }

        return address;
    }
}
