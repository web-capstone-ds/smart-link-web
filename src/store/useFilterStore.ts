import { create } from 'zustand'
import type { DateRange } from 'react-day-picker'

interface FilterState {
    // 전역 적용 상태 (조회 버튼을 눌렀을 때 확정되는 값)
    appliedLine: string;
    appliedDate: DateRange | undefined;
    
    // 상태 업데이트 함수
    setAppliedLine: (line: string) => void;
    setAppliedDate: (date: DateRange | undefined) => void;
}

// 기본값(어제 날짜) 계산
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const useFilterStore = create<FilterState>((set) => ({
    appliedLine: "all",
    appliedDate: { from: yesterday, to: yesterday },
    
    setAppliedLine: (line) => set({ appliedLine: line }),
    setAppliedDate: (date) => set({ appliedDate: date }),
}))