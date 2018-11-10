import { Component, OnInit } from '@angular/core';
import { Costumer } from '../../entities';

@Component({
    templateUrl: './costumers-list.page.html',
    styleUrls: ['./costumers-list.page.scss']
})
export class CostumersListPage implements OnInit {

    customers: Costumer[];

    state: 'recent' | 'search';
    recentOrder: 'asc' | 'desc';
    searchOrder: 'asc' | 'desc';

    constructor() {
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
