
export enum ChartPeriodType {
    Month = 0,
    Week = 1,
    Daily = 3
}

// export interface SalesCharts {
//     syncTimestamp: string;
//     dateTimestamp: string;
//     data: CompanySales[];
// }

export interface SalesData {
    dataTimestamp: string;
    data: SalesDataCharts;
}

export interface SalesDataCharts {
    key: string;
    name: string;
    chartBundle: ChartBundle[];
    currency: string;
    reportingCurrency: string;
    isGlobal: boolean;
}

export interface ChartBundle {
    key: string;
    order: number;
    titles: {[key: string]: string };
    isTimeChart: boolean;
    periodType: ChartPeriodType;
    currency: string;
    reportingCurrency: string;
    series: Serie[];
    charts: ChartData[];
    filters: Filter[];
}

export interface Serie {
    key: string;
    legend: string;
}

export interface ChartData {
    valueType: 'abs' | 'accum';
    hasTotal: boolean;
    dataSet: DataSet[];
}

export interface DataSet {
    period: string;
    dataPoints: DataPoint[];
    hasTotal: boolean;
}

export interface DataPoint {
    label: string;
    description: string;
    values: {seriesKey: string, value: number, reportingValue: number }[];
    isTotal: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface Filter {
}
