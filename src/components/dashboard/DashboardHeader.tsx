import { format, isSameDay } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils"
import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

interface DashboardHeaderProps {
    // 제목 및 부제목
    title: string;
    subtitle: string;
    // 라인 필터 상태 및 핸들러
    line: string;
    onLineChange: (value: string) => void;
    // 날짜 필터 상태 및 핸들러
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    // 조회 버튼 클릭 핸들러
    onSearch: () => void;
    // 팝업 제어용 Props
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
}

export function DashboardHeader({
    title, subtitle,
    line, onLineChange,
    date, onDateChange,
    onSearch,
    isCalendarOpen, onCalendarOpenChange,
}: DashboardHeaderProps){

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1); 

    return(
        <div className="flex items-end justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
                {/* 라인 선택기 */}
                <Select value={line} onValueChange={onLineChange}>
                <SelectTrigger className="w-40 bg-card border-border text-foreground font-medium h-10">
                    <SelectValue placeholder="라인 선택" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">전체 라인</SelectItem>
                    <SelectItem value="line-a">SAW-LINE A</SelectItem>
                    <SelectItem value="line-b">SAW-LINE B</SelectItem>
                    <SelectItem value="line-c">SAW-LINE C</SelectItem>
                </SelectContent>
                </Select>

                {/* 캘린더 (D-1 기본, 미래 날짜 비활성화 로직 포함) */}
                <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
                    <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-58 justify-start text-left font-normal bg-card border-border h-10",
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
                <PopoverContent className="w-auto p-0 flex flex-col" align="end">
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
                        onClick={() => onDateChange(undefined)}
                        className="text-xs text-muted-foreground hover:text-foreground h-8"
                    >
                        선택 지우기
                    </Button>
                    </div>
                </PopoverContent>
                </Popover>

                <Button variant="default" className="px-5 h-10" onClick={onSearch}>
                조회
                </Button>
            </div>
        </div>
    )
}