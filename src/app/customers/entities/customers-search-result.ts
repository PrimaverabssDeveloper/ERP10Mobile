import { Customer } from './customer';

export interface CustomersSearchResult {
    hasMore: boolean;
    customers: Customer[];
}
