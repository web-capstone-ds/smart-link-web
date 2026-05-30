import { Calendar as CalendarIcon } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { ko } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DateRangeSelect({ date, onDateChange, isOpen, onOpenChange }: DateRangePickerProps) {
    
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1); 

    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "h-10 w-full justify-start border-border bg-card text-left font-normal sm:w-58",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to && !isSameDay(date.from, date.to) ? (
                            <>
                                {format(date.from, "yy.MM.dd")} - {format(date.to, "yy.MM.dd")} <span className="ml-1 text-muted-foreground">(기간)</span>
                            </>
                        ) : (
                            <>
                                {format(date.from, "yyyy. MM. dd")} <span className="ml-1 text-muted-foreground">(하루)</span>
                            </>
                        )
                    ) : (
                        <span>날짜 선택</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex max-w-[calc(100vw-2rem)] flex-col overflow-auto p-0 sm:w-auto" align="end">
                <Calendar
                    mode="range"
                    defaultMonth={lastMonth}
                    selected={date}
                    onSelect={onDateChange}
                    numberOfMonths={2}
                    locale={ko}
                    disabled={{ after: today }}
                />
                <div className="p-2 border-t border-border flex justify-end bg-muted/20">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                            onDateChange(undefined);
                            onOpenChange(false); // 선택 지우기 시 팝업 닫기
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground h-8"
                    >
                        선택 지우기
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
