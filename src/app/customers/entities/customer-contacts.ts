import { CustomerOtherContacts } from './customer-other-contact';
import { CustomerOtherAddress } from './customer-other-address';

export interface CustomerContacts {
    phone: string;
    phone2: string;
    fax: string;
    address: string;
    address2: string;
    location: string;
    postalCode: string;
    postalLocation: string;
    webAddress: string;
    otherAddresses: CustomerOtherContacts[];
    otherContacts: CustomerOtherAddress[];
}
