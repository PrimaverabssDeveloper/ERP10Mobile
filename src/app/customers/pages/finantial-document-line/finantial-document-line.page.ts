import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Customer, DocumentLine, DocumentValue, FinantialDocumentDocumentHeaderConfiguration } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './finantial-document-line.page.html',
    styleUrls: ['./finantial-document-line.page.scss'],
    providers: [CustomersServiceProvider]
})
export class FinancialDocumentLinePage extends PageBase implements OnInit {

    documentLine: DocumentLine;
    documentLineValues: DocumentValue[];
    documentHeaderItems: DocumentValue[];
    headerConfiguration: FinantialDocumentDocumentHeaderConfiguration;

    sidebarColorIndex: number;

    constructor(
        public loadingController: LoadingController,
        private route: ActivatedRoute,
    ) {
        super(loadingController);
    }

    /**
    * Execute on page initialization.
    *
    * @memberof FinancialDocumentLinePage
    */
    async ngOnInit() {
        const documentLineJson = this.route.snapshot.queryParams['documentLine'];
        const documentHeaderItemsJson = this.route.snapshot.queryParams['documentHeaderItems'];
        const headerConfigurationJson = this.route.snapshot.queryParams['headerConfiguration'];

        this.documentLine = JSON.parse(documentLineJson);
        this.documentHeaderItems = JSON.parse(documentHeaderItemsJson);
        this.headerConfiguration = JSON.parse(headerConfigurationJson);

        this.documentLineValues = [];
        for (const dv of this.documentLine.values) {
            if (dv.state === 0) {
                this.documentLineValues.push(dv);
            }
        }

        const colorDv = this.documentLine.values.find(dv => dv.state === 1 && dv.key === 'SidebarColorState');
        if (colorDv) {
            this.sidebarColorIndex = colorDv.value as number;
        }
    }
}
