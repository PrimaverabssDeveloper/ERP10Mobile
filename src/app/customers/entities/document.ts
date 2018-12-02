import { MoneyValue, LocalizedString } from '../../core/entities';


export interface Document {
    type: string;
    headerItems: DocumentValue[];
    lines: DocumentLine[];
}

export interface DocumentLine {
    type: string;
    values: DocumentValue[];
}

export interface DocumentValue {
    type: DocumentValueType;
    key: string;
    value: string | number | LocalizedString | MoneyValue;
    state: number;
    label: LocalizedString;
}

export enum DocumentValueType {
    string,
    money,
    date,
    number,
    precentage,
    localizedString
}
