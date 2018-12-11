
export interface SalesCharts {
    syncTimestamp: string;
    dateTimestamp: string;
    data: CompanySales[];
}

export interface CompanySales {
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
    periodType: 'M' | 'W';
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
    valueType: string;
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
