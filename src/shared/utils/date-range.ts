export function getDateRange(from?: Date, to?: Date) {
    const conditions: {
        fromDate?: Date;
        toDate?: Date;
    } = {};

    if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        conditions.fromDate = fromDate;
    }

    if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        conditions.toDate = toDate;
    }

    return conditions;
}