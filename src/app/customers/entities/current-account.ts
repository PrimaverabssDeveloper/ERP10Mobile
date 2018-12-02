
import { Document } from './document';

export interface CurrentAccount {
    currency: string;
    total: number;
    unexpired: {
        total: number;
        documents: Document[];
    };
    expiredThirtyDays: {
        total: number;
        documents: Document[];
    };
    expiredSixtyDays: {
        total: number;
        documents: Document[];
    };
}
