import { CustomerContacts } from './customer-contacts';
import { CustomerSales } from './customer-sales';

export interface Customer {
    name: string;
    key: string;
    companyKey: string;
    location: string;
    contacts: CustomerContacts;
    sales: CustomerSales;
}
