

export interface Salaries {
    employeeId: string;
    currency: string;
    data: YearSalary[];
}

export interface BaseSalary {
    paymentDistribution: LocalizedValue[];
    paymentMethods: LocalizedValue[];
    documents: LocalizedValue[];
    discounts: LocalizedValue[];
}

export interface YearSalary extends BaseSalary {
    year: number;
    months: MonthSalary[];
    grossTotal: Value;
    netTotal: Value;
}

export interface MonthSalary extends BaseSalary {
    year: number;
    month: number;
    paymentEmitDate: string;
    grossValue: Value;
    netValue: Value;
}

export interface Value {
    value: number;
    precentage: number;
}

export interface LocalizedValue extends Value {
    label: {[key: string]: string };
}
