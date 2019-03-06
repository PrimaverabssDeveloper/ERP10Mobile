import { Component, Input } from '@angular/core';
import { Company } from '../../entities';


@Component({
    templateUrl: './company-selector.component.html',
    styleUrls: ['./company-selector.component.scss']
})

export class CompanySelectorComponent {
    @Input() companies: Company[];
    @Input() onCompanySelected: (company: Company) => void;

    constructor() {

    }

    companySelectedAction(company: Company) {
        this.onCompanySelected(company);
    }
}
