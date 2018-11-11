
export interface CustomerSales {
    currency: string;
    totalSales: {
        previousSales: number;
        currentSales: number;
    };
    pendingOrders: number;
    valueCurrentAccount: number;
    averagePayDays: {
        days: number,
        paymentConditions: number
    };
    recentActivity: {
        type: string;
        number: string;
        date: string;
    };
}
