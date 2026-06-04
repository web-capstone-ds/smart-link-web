import type { DateRange } from "react-day-picker";

export function isDemoMockDate(date: Date | undefined | null) {
    if (!date) return false;
    return date.getMonth() === 4 && (date.getDate() === 30 || date.getDate() === 31);
}

export function isDemoMockDateRange(dateRange: DateRange | undefined) {
    if (!dateRange?.from || !isDemoMockDate(dateRange.from)) return false;
    return !dateRange.to || isSameCalendarDay(dateRange.from, dateRange.to);
}

function isSameCalendarDay(left: Date, right: Date) {
    return (
        left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate()
    );
}
