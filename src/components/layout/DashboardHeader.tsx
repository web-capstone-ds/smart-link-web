import type { DateRange } from "react-day-picker";
import { Button } from "../ui/button";

import {EquipmentSelect} from "@/components/selector/EquipmentSelect"
import { DateRangeSelect } from "@/components/selector/DateRangeSelect";

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    equipment: string[];
    onEquipmentChange: (value: string[]) => void;
    equipmentOptions: string[];
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    onSearch: () => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
}

export function DashboardHeader({
    title, subtitle,
    equipment, onEquipmentChange,
    equipmentOptions,
    date, onDateChange,
    onSearch,
    isCalendarOpen, onCalendarOpenChange
}: DashboardHeaderProps){

    return(
        <div className="flex items-end justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">

                {/* 1. 장비 다중 선택기 */}
                <EquipmentSelect 
                    options={equipmentOptions}
                    selected={equipment}
                    onChange={onEquipmentChange}
                />

                {/* 2. 날짜 및 기간 선택기 */}
                <DateRangeSelect
                    date={date}
                    onDateChange={onDateChange}
                    isOpen={isCalendarOpen}
                    onOpenChange={onCalendarOpenChange}
                />

                {/* 3. 조회 버튼 */}
                <Button variant="default" className="px-5 h-10" onClick={onSearch}>
                    조회
                </Button>
            </div>
        </div>
    );
}