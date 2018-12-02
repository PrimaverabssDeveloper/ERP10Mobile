import { PageBase } from '../../../shared/pages';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Document, FinantialDocumentPageConfiguration, DocumentValue, DocumentLine } from '../../entities';
import { CustomersService, CustomersServiceProvider } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './finantial-document.page.html',
    styleUrls: ['./finantial-document.page.scss'],
    providers: [CustomersServiceProvider]
})
export class FinancialDocumentPage extends PageBase implements OnInit {

    document: Document;
    configuration: FinantialDocumentPageConfiguration;
    documentValues: DocumentValue[];

    constructor(
        public loadingController: LoadingController,
        private customersService: CustomersService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(loadingController);
    }

    /**
    * Execute on page initialization.
    *
    * @memberof CustomerPage
    */
    async ngOnInit() {
        const documentJson = this.route.snapshot.queryParams['document'];
        const configurationJson = this.route.snapshot.queryParams['configuration'];

        this.document = JSON.parse(documentJson);
        this.configuration = JSON.parse(configurationJson);

        this.documentValues = this.getDocumentValuesForKeys(this.document.headerItems, this.configuration.documentHeaderListKeys);
    }

    async documentLineAction(line: DocumentLine) {
        const commands = ['customers/customer', 'finantialdocumentline'];

        const extras = {
            queryParams: {
                documentLine: JSON.stringify(line),
                documentHeaderItems: JSON.stringify(this.document.headerItems),
                headerConfiguration: JSON.stringify(this.configuration.documentHeader),
            }
        };

        this.router.navigate(commands, extras);
    }

    private getDocumentValuesForKeys(documentValues: DocumentValue[], documentsKeys: string[]): DocumentValue[] {

        if (!documentValues) {
            throw Error('The parameter "documentValues" can not be null');
        }

        if (!documentsKeys) {
            throw Error('The parameter "documentsKeys" can not be null');
        }

        const filteredDocuments: DocumentValue[] = [];
        for (const documentKey of documentsKeys) {
            const documentValue = documentValues.find(dv => dv.key === documentKey);

            if (documentValue) {
                filteredDocuments.push(documentValue);
            }
        }

        return filteredDocuments;
    }
}
