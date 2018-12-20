

export interface Salaries {
    employeeId: string;
    currency: string;
    data: YearSalary[];
}

export interface BaseSalary {
    deductions: LocalizedValue[];
    salaryBreakdown: LocalizedValue[];
    paymentMethods: LocalizedValue[];
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
    percentage: number;
}

export interface LocalizedValue extends Value {
    label: {[key: string]: string };
}
