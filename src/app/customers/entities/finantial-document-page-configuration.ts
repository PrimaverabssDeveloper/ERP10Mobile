


export interface FinantialDocumentPageConfiguration {
    documentHeader: FinantialDocumentDocumentHeaderConfiguration;
    documentHeaderListKeys: string[];
    documentLines: FinantialDocumentLineRowConfiguration;
}

export interface FinantialDocumentDocumentHeaderConfiguration {
    titleKey: string;
    dateKey: string;
    secondDateKey?: string;
    valueKey: string;
    secondValueKey?: string;
    accentColor?: string;
}

export interface FinantialDocumentLineRowConfiguration {
    titleKey: string;
    leftValueKey: string;
    rightValueKey: string;
}
