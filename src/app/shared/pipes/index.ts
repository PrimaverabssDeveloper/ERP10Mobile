import { RoundPipe } from './round.pipe';
import { AbsolutePipe } from './absolute.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { CurrencySymbolPipe } from './currency-symbol.pipe';
import { LocalizedStringsPipe } from './localized-strings.pipe';
import { OrderByPipe } from './order-by.pipe';
import { LocaleCurrencyPipe } from './locale-currency.pipe';
import { LocaleDatePipe } from './locale-date.pipe';

export * from './round.pipe';
export * from './absolute.pipe';
export * from './safe-url.pipe';
export * from './currency-symbol.pipe';
export * from './order-by.pipe';
export * from './localized-strings.pipe';
export * from './locale-currency.pipe';
export * from './locale-date.pipe';

export const PIPES = [
    RoundPipe,
    AbsolutePipe,
    SafeUrlPipe,
    CurrencySymbolPipe,
    LocalizedStringsPipe,
    OrderByPipe,
    LocaleCurrencyPipe,
    LocaleDatePipe
];
