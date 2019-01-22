import { Component, OnInit, Input } from '@angular/core';
import { SalaryChartVerticalAxis } from '../salary-chart/salary-chart.component';
import { SalaryDocument } from '../../models';
import { PopoverController } from '@ionic/angular';

@Component({
    templateUrl: './documents-list.component.html',
    styleUrls: ['./documents-list.component.scss']
})

export class DocumentsListComponent {
    @Input() documents: SalaryDocument[];

    constructor(public popoverCtrl: PopoverController) {

    }

    shareAction(document: SalaryDocument) {
        this.popoverCtrl.dismiss({
            action: 'share',
            document: document
        });
    }

    viewAction(document: SalaryDocument) {
        this.popoverCtrl.dismiss({
            action: 'view',
            document: document
        });
    }
}
