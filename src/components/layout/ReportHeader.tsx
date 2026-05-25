import { Filter, Printer, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isSameDay, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface ReportHeaderProps {
    reportMode: "daily" | "weekly" | "equipment";
    setReportMode: (mode: "daily" | "weekly" | "equipment") => void;
    targetEq: string;
    setTargetEq: (eq: string) => void;
    equipmentOptions: string[];

    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    onSearch: () => void;
}

export function ReportHeader({
    reportMode,
    setReportMode,
    targetEq,
    setTargetEq,
    equipmentOptions,
    date, onDateChange, isCalendarOpen, onCalendarOpenChange, onSearch
}: ReportHeaderProps) {
    
    const today = new Date();
    const lastMonth = subMonths(today, 1); // 저번 달

    const handleDateSelect = (newDate: DateRange | undefined) => {
        onDateChange(newDate);

        if (!newDate?.from) return;

        // 장비별 리포트 모드일 때는 날짜를 바꿔도 장비 모드가 유지되어야 하므로 제외
        if (reportMode !== "equipment") {
            if (!newDate.to || isSameDay(newDate.from, newDate.to)) {
                // 시작일과 종료일이 같거나 종료일이 없으면 '일일 리포트' 자동 활성화
                setReportMode("daily");
            } else {
                // 시작일과 종료일이 다르면 '기간 누적 리포트' 자동 활성화
                setReportMode("weekly");
            }
        }
    };

    // 인쇄 트리거 함수
    const handlePrint = () => {
        const printTarget = document.querySelector(".report-print-area");

        if (!printTarget) {
            window.print();
            return;
        }

        const frame = document.createElement("iframe");
        frame.title = "report-print-frame";
        frame.style.position = "fixed";
        frame.style.right = "0";
        frame.style.bottom = "0";
        frame.style.width = "0";
        frame.style.height = "0";
        frame.style.border = "0";
        frame.style.opacity = "0";

        document.body.appendChild(frame);

        const frameDocument = frame.contentDocument;
        const frameWindow = frame.contentWindow;

        if (!frameDocument || !frameWindow) {
            frame.remove();
            window.print();
            return;
        }

        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map((node) => node.outerHTML)
            .join("\n");

        frameDocument.open();
        frameDocument.write(`
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Smart Link Report</title>
                    ${styles}
                </head>
                <body>
                    ${printTarget.outerHTML}
                </body>
            </html>
        `);
        frameDocument.close();

        const removeFrame = () => {
            setTimeout(() => frame.remove(), 300);
        };

        frameWindow.onafterprint = removeFrame;
        setTimeout(() => {
            frameWindow.focus();
            frameWindow.print();
        }, 250);
        setTimeout(() => {
            if (frame.isConnected) frame.remove();
        }, 60_000);
    };

    return (
        <div className="w-[210mm] flex flex-col gap-4 bg-card p-4 rounded-lg border border-border shadow-sm print:hidden">
            
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted-foreground" /> 리포트 컨트롤 패널
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">인쇄용 데이터 요약 초안(Draft) 생성기</p>
                </div>
                <div className="ml-auto flex items-center justify-end gap-2">
                    <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-58 justify-start text-left font-normal bg-card border-border h-9 text-xs",
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
                                onSelect={handleDateSelect}
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

                    {/* 🌟 분리된 외부 조회 버튼 */}
                    <Button size="sm" className="px-5 h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSearch}>
                        조회
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2 h-9 text-xs ml-2" onClick={handlePrint}>
                        <Printer className="w-4 h-4" /> 초안 인쇄
                    </Button>
                </div>
            </div>

            {/* 필터 옵션 */}
            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                    <button 
                        onClick={() => {
                            // 탭을 누를 때, 현재 날짜가 하루면 daily, 여러 날이면 weekly로 똑똑하게 세팅!
                            if (!date?.to || isSameDay(date.from!, date.to)) {
                                setReportMode("daily");
                            } else {
                                setReportMode("weekly");
                            }
                        }} 
                        className={cn(
                            "px-4 py-1.5 text-xs font-bold rounded-sm transition-colors",
                            (reportMode === 'daily' || reportMode === 'weekly') ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        종합 리포트
                    </button>

                    {/* 🌟 2. '장비별 리포트' 탭 */}
                    <button 
                        onClick={() => setReportMode("equipment")} 
                        className={cn(
                            "px-4 py-1.5 text-xs font-bold rounded-sm transition-colors",
                            reportMode === 'equipment' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        장비별 리포트
                    </button>

                </div>

                {/* '장비별 리포트' 모드일 때만 나타나는 동적 드롭다운 */}
                {reportMode === "equipment" && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <span className="text-xs font-bold text-muted-foreground">대상 장비:</span>
                        <Select value={targetEq} onValueChange={setTargetEq}>
                            <SelectTrigger className="w-36 h-8 text-xs bg-background border-border">
                                <SelectValue placeholder="장비 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {equipmentOptions.map((eq) => (
                                    <SelectItem key={eq} value={eq} className="text-xs">
                                        {eq}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
}
