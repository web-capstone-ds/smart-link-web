import { create } from 'zustand'
import type { DateRange } from 'react-day-picker'
import { format } from "date-fns";

interface FilterState {
    // 전역 적용 상태 (조회 버튼을 눌렀을 때 확정되는 값)
    appliedEquipmentIds: string[];
    appliedDate: DateRange | undefined;
    
    // 상태 업데이트 함수
    setAppliedEquipmentIds: (ids: string[]) => void;
    setAppliedDate: (date: DateRange | undefined) => void;

    lastUpdated: string;
    setLastUpdated: (time: string) => void;
}

// 기본값(어제 날짜) 계산
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const useFilterStore = create<FilterState>((set) => ({
    appliedEquipmentIds: [],
    appliedDate: { from: yesterday, to: yesterday },
    
    setAppliedEquipmentIds: (ids) => set({ appliedEquipmentIds: ids }),
    setAppliedDate: (date) => set({ appliedDate: date }),

    lastUpdated: format(new Date(), "yyyy-MM-dd HH:mm 'KST'"), 
    setLastUpdated: (time) => set({ lastUpdated: time }),
}))