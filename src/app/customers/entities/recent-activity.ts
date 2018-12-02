
import { Document } from './document';

export interface RecentActivity {
    invoices: Document[];
    orders: Document[];
    payments: Document[];
}
