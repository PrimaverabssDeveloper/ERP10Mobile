import { Component, OnInit } from '@angular/core';
import { Customer } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';

@Component({
    templateUrl: './customers-list.page.html',
    styleUrls: ['./customers-list.page.scss'],
    providers: [CustomersServiceProvider]
})
export class CustomersListPage implements OnInit {

    customers: Customer[];

    state: 'recent' | 'search';
    recentOrder: 'asc' | 'desc';
    searchOrder: 'asc' | 'desc';

    constructor(private customersService: CustomersService) {
        this.state = 'recent';
        this.recentOrder = 'asc';
        this.searchOrder = 'asc';
    }

    /**
    * Execute on page initialization.
    *
    * @memberof CostumersListPage
    */
    ngOnInit(): void {

        this.customers = [
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            },
            {
                name: 'DSF Lts',
                companyKey: 'ALCAD',
                key: 'DSF',
                location: 'Braga'
            }
        ];
    }

    recentOptionAction() {
        if (this.state === 'recent') {
            this.recentOrder = this.recentOrder === 'asc' ? 'desc' : 'asc';

        } else {
            this.state = 'recent';
        }
    }

    searchOptionAction() {
        if (this.state === 'search') {
            this.searchOrder = this.searchOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.state = 'search';
        }
    }
}
