import { Component, Input } from '@angular/core';
import { Company } from '../../entities';


@Component({
    templateUrl: './company-selector.component.html',
    styleUrls: ['./company-selector.component.scss']
})

export class CompanySelectorComponent {
    @Input() companies: Company[];

    companySelectedAction(company: Company) {

    }
}
