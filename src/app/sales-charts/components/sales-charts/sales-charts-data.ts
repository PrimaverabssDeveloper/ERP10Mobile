import { ChartBundle } from '../../entities';

export class SalesChartsData {
    companyKey: string;
    chartBundles: ChartBundle[];
    useReportingValue: boolean;
    accentColor: {r: number, g: number, b: number};
    currentYearAccentColor: {r: number, g: number, b: number};
    previousYearAccentColor: {r: number, g: number, b: number};
}
