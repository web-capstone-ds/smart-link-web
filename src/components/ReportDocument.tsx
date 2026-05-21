import { Cpu, Activity, AlertTriangle, CheckCircle2, Settings2 } from "lucide-react";
import type { ReportSummary, QualityDistribution, ReportHeatmap, ReportAlarm } from "@/type/reportType";
import { equipmentComparisonData } from "@/data/mockData"; // 4번 표 렌더링용 (추후 API로 대체 가능)
import type { EquipmentStatus } from "@/type/equipmentType";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";


export interface ReportDocumentProps {
    reportMode: "daily" | "weekly" | "equipment";
    targetEq: string;
    safeReportData: ReportSummary;
    safeQualityData: QualityDistribution;
    safeHeatmapData: ReportHeatmap;
    safeDefectData: any[]; 
    safeAlarmData: ReportAlarm[]; 
    safeEquipmentData: EquipmentStatus[];
    appliedDate: DateRange | undefined; // 🌟 1. 부모(전역 상태)로부터 날짜를 받기 위해 추가!
    isLoading: boolean;
}

export function ReportDocument({
    reportMode,
    targetEq,
    safeReportData,
    safeQualityData,
    safeHeatmapData,
    safeDefectData,
    safeAlarmData,
    safeEquipmentData,
    appliedDate,
    isLoading
}: ReportDocumentProps) {

    // 동적 텍스트 생성
    // 🌟 3. '주간(Weekly)'이라는 단어를 지우고 '기간 누적(Period Summary)'으로 변경
    const isComprehensive = reportMode === "daily" || reportMode === "weekly";
    const reportTitle = reportMode === "daily" ? "DAILY REPORT" : reportMode === "weekly" ? "PERIOD SUMMARY REPORT" : "EQUIPMENT DETAIL";
    const reportSubtitle = reportMode === "daily" ? "일일 공정 분석 리포트" : reportMode === "weekly" ? "지정 기간 라인 누적 데이터 요약" : `${targetEq} 상세 분석 리포트`;
    
    // 🌟 4. 하드코딩된 날짜를 걷어내고, 달력에서 선택한 appliedDate를 예쁘게 포맷팅 (TS 에러 완벽 방어)
    const periodText = appliedDate?.from 
        ? appliedDate.to 
            ? `${format(appliedDate.from as Date, 'yyyy.MM.dd')} ~ ${format(appliedDate.to as Date, 'yyyy.MM.dd')}`
            : format(appliedDate.from as Date, 'yyyy.MM.dd')
        : "기간 미지정";
        
        // 🌟 1. 현재 시각을 'yyyy. MM. dd HH:mm' 포맷으로 가져오기
    const issueDateTime = format(new Date(), 'yyyy. MM. dd HH:mm');

    // 🌟 2. 대상 텍스트 동적 분기 (종합 리포트면 전체 라인, 장비 리포트면 타겟 장비)
    const targetText = isComprehensive ? '장비 전체' : targetEq;

    const targetEqData = safeEquipmentData[0] || {};

    const worstEquipments = [...safeEquipmentData]
        .sort((a, b) => a.yield - b.yield) // 수율이 낮을수록(상태가 안 좋을수록) 위로 배치
        .slice(0, 5); // A4 용지에 꽉 차지 않도록 상위 5개만 컷!

    // KPI 배열 동적 구성 (safeReportData 연동)
    // 🌟 2안 적용 시: 하드코딩된 가짜 증감율(trend) 텍스트 제거
    const kpiItems = [
        { 
            label: reportMode === 'weekly' ? "누적 생산량" : "총 생산량", 
            value: `${safeReportData.kpi.totalProduction.toLocaleString()} EA`, 
            sub: "집계 기간 내 전체", trend: "", trendColor: "" 
        },
        { 
            label: "종합 수율 (Yield)", 
            value: `${safeReportData.kpi.yield}%`, 
            sub: "최종 양품 비율", trend: "", trendColor: "" 
        },
        { 
            label: "공정능력지수 (Cpk)", 
            value: safeReportData.kpi.cpk.toString(), 
            sub: safeReportData.kpi.cpk < 1.33 ? "Grade: Warning" : "Grade: Excellent", 
            // 🌟 Cpk는 계산 로직이 있으므로 이 정도의 동적 트렌드는 남겨둘 수 있습니다.
            trend: safeReportData.kpi.cpk < 1.33 ? "조치 요망" : "안정적", 
            trendColor: safeReportData.kpi.cpk < 1.33 ? "text-red-500" : "text-emerald-600" 
        },
        { 
            label: "설비종합효율 (Availability)", 
            value: `${safeReportData.kpi.availability}%`, 
            sub: "실가동률 지표", trend: "", trendColor: "" 
        },
        { 
            label: "비가동 요인 경보", 
            value: `${safeReportData.kpi.activeAlerts} 건`, 
            sub: "현재 기준 미조치 알람", 
            trend: safeReportData.kpi.activeAlerts > 0 ? "확인 필요" : "양호", 
            trendColor: safeReportData.kpi.activeAlerts > 0 ? "text-red-600" : "text-emerald-600" 
        },
        { 
            label: "평균 무고장 (MTBF)", 
            value: `${safeReportData.kpi.mtbf} hr`, 
            sub: "연속 가동 시간", trend: "", trendColor: "" 
        },
    ];

    return (
        <>
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden transition-all">
            
            {/* 🌟 로딩 중일 때 흐리게 처리하여 데이터 갱신 중임을 시각적으로 안내 */}
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="animate-pulse font-bold text-zinc-400 text-xl tracking-widest">
                        UPDATING REPORT...
                    </div>
                </div>
            )}

            <div className="absolute top-[40%] left-[-10%] w-[120%] -rotate-45 text-[120px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>
            
            {/* 1. 헤더 & 결재란 */}
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-2">{reportTitle}</h1>
                    <p className="text-sm font-bold text-zinc-500 mb-4">{reportSubtitle}</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-zinc-600">
                        {/* 🌟 하드코딩된 날짜 지우고 issueDateTime 바인딩 */}
                        <p><span className="font-bold text-zinc-400 mr-2">발행 일시:</span> {issueDateTime}</p>
                        <p><span className="font-bold text-zinc-400 mr-2">작성자:</span> 시스템 자동 생성 (초안)</p>
                        <p><span className="font-bold text-zinc-400 mr-2">집계 기간:</span> {periodText}</p>
                        {/* 🌟 하드코딩 지우고 targetText 바인딩 */}
                        <p><span className="font-bold text-zinc-400 mr-2">대상:</span> {targetText}</p>
                    </div>
                </div>

                {/* 초안 검토용 심플 결재란 */}
                <div className="flex border border-zinc-300 text-center text-[10px] bg-white">
                    <div className="w-16 border-r border-zinc-300">
                        <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold text-zinc-600">초안 생성</div>
                        <div className="h-16 flex items-center justify-center font-bold text-zinc-400">System</div>
                    </div>
                    <div className="w-16">
                        <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold text-zinc-600">데이터 검토</div>
                        <div className="h-16"></div>
                    </div>
                </div>
            </div>

            {/* 2. AI 상태 요약 (API 데이터 바인딩) */}
            <div className="bg-zinc-900 text-white p-6 rounded-md mb-8 relative overflow-hidden print:border print:border-zinc-300 print:bg-white print:text-zinc-900 z-10">
                <div className="absolute -right-2.5 -top-2.5 opacity-10 print:opacity-5">
                    <Cpu className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-zinc-400 mb-2 flex items-center gap-2 print:text-zinc-600 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse print:animate-none"></div>
                        AI Data Insight
                    </h3>
                    <p className="text-sm leading-relaxed font-medium">
                        {safeReportData.aiMessage}
                    </p>
                </div>
            </div>

            {/* 3. 핵심 요약 지표 (API 데이터 바인딩) */}
            <div className="grid grid-cols-3 gap-4 mb-8 z-10">
                {kpiItems.map((kpi, idx) => (
                    <div key={idx} className="border border-zinc-200 p-4 rounded-md bg-zinc-50/80">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">{kpi.label}</p>
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-black text-zinc-900">{kpi.value}</span>
                            <span className={`text-[10px] font-bold ${kpi.trendColor}`}>{kpi.trend}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* 🌟 4. 메인 데이터 테이블 및 요약 박스 (모드에 따라 완벽 분기 렌더링) */}
            <div className="mt-2 flex-1 z-10">
                <h3 className="text-xs font-bold text-zinc-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-zinc-900"></div> 
                    {isComprehensive ? '주요 요주의 장비 현황 (수율 하위 Top 5)' : `${targetEq} 생산 및 상태 현황`}
                </h3>
                
                {isComprehensive ? (
                    // ----------------------------------------------------
                    // [종합 리포트 모드] 수율 하위 5개 (Worst 5) 테이블
                    // ----------------------------------------------------
                    <>
                        <table className="w-full text-[11px] border-collapse bg-white">
                            <thead>
                                <tr className="border-y-2 border-zinc-800 bg-zinc-100">
                                    <th className="py-2.5 px-3 text-left font-bold text-zinc-700">장비 ID (Recipe)</th>
                                    <th className="py-2.5 px-2 text-center font-bold text-zinc-700">상태</th>
                                    <th className="py-2.5 px-3 text-left font-bold text-zinc-700">가동률</th>
                                    <th className="py-2.5 px-3 text-right font-bold text-zinc-700">검사 / Fail</th>
                                    <th className="py-2.5 px-3 text-right font-bold text-zinc-700">수율</th>
                                    <th className="py-2.5 px-3 text-left pl-6 font-bold text-zinc-700">주요 불량</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {worstEquipments.map((eq) => (
                                    <tr key={eq.id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-zinc-900">{eq.id}</span>
                                                <span className="text-[9px] text-zinc-500 font-medium">{eq.recipe}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            {eq.unresolvedAlert ? (
                                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-red-200 bg-red-50 text-red-600 text-[9px] font-bold">
                                                    <AlertTriangle className="w-3 h-3" /> 조치필요
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 text-zinc-400 text-[9px] font-medium">
                                                    <CheckCircle2 className="w-3 h-3" /> 정상
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2 w-20">
                                                <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${eq.uptime < 90 ? 'bg-red-500' : eq.uptime < 95 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                        style={{ width: `${eq.uptime}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-[10px] font-bold ${eq.uptime < 90 ? 'text-red-600' : 'text-zinc-700'}`}>
                                                    {eq.uptime}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-zinc-900">{eq.total.toLocaleString()}</span>
                                                <span className="text-[9px] text-red-500">{eq.fail} F</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-right font-black text-zinc-900">{eq.yield}%</td>
                                        <td className="py-3 px-3 pl-6 text-zinc-600 font-medium truncate max-w-[150px]">{eq.majorDefect}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-[9px] text-zinc-400 mt-2 text-right">
                            * 전체 장비 중 수율 하위 5대 장비의 데이터만 발췌하여 요약했습니다. 전체 데이터는 웹 대시보드를 참조하십시오.
                        </p>
                    </>
                ) : (
                    // ----------------------------------------------------
                    // [장비별 리포트 모드] 기존 디자인 요약 박스
                    // ----------------------------------------------------
                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-md flex flex-col justify-center">
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                본 페이지는 <span className="font-bold text-zinc-900 bg-zinc-200 px-1">{targetEq}</span> 장비에 대한 특정 기간 내 상세 퍼포먼스 및 불량 내역을 요약한 초안입니다. <br/><br/>
                                해당 장비는 현재 <span className="font-bold text-zinc-900">{targetEqData.recipe || '-'}</span> 레시피로 가동 중이며, 수율은 <span className="font-bold text-zinc-900">{targetEqData.yield || '-'}%</span>를 기록하고 있습니다. 
                                주요 불량 요인으로는 <span className="font-bold text-red-600">{targetEqData.majorDefect || '-'}</span>이 지목되었습니다.
                            </p>
                        </div>
                        <div className="bg-white border border-zinc-200 p-5 rounded-md flex items-center justify-center flex-col border-dashed">
                            <Activity className="w-8 h-8 text-zinc-300 mb-2" />
                            <p className="text-[10px] font-bold text-zinc-400">상세 파라미터 및 결함 히트맵은</p>
                            <p className="text-[10px] font-bold text-zinc-400">다음 2페이지를 참조하십시오.</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* 하단 푸터 */}
            <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-200 z-10">
                <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
                <p className="font-bold text-zinc-500">Page 01</p>
            </div>
        </div>
        
        {/* ========================================== */}
        {/* 📄 리포트 2페이지 (품질 및 치수 분석) */}
        {/* ========================================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden mt-8 transition-all">
            
            {/* 🌟 로딩 중 블러 효과 */}
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="animate-pulse font-bold text-zinc-400 text-xl tracking-widest">UPDATING REPORT...</div>
                </div>
            )}

            <div className="absolute top-[40%] left-[-10%] w-[120%] -rotate-45 text-[120px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>

            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none z-0">
                <Activity className="w-64 h-64 text-zinc-900" />
            </div>

            <div className="mb-8 z-10">
                <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                    <span className="text-zinc-400 font-normal">02.</span> 
                    {reportMode === 'equipment' ? `${targetEq} 품질 및 결함 정밀 분석` : '품질 및 치수 상세 분석'}
                </h2>
            </div>

            {/* 🌟 상단 섹션 분기: 장비 모드(8슬롯 히트맵) vs 전체 모드(Cpk 산포도) */}
            {reportMode === "equipment" ? (
                // [장비별 모드] 6-6 API: 8슬롯 결함 히트맵 및 AI 분석
                <div className="mb-10 z-10 animate-in fade-in duration-500">
                    <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-900"></div> 불량 발생 슬롯 분석 (8-Slot Defect Heatmap)
                    </h3>
                    
                    <div className="grid grid-cols-5 gap-6">
                        {/* 좌측: 8슬롯 그리드 시각화 (5-3에서 만든 구조 재활용) */}
                        <div className="col-span-2 flex flex-col items-center justify-center bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                            <div className="grid grid-cols-2 gap-1 w-full max-w-[140px]">
                                {Array.from({ length: 8 }).map((_, i) => {
                                    // 데이터 바인딩
                                    const slot = safeHeatmapData.slots.find(s => s.zAxisNum === i) || { passCount: 0, failCount: 0, severity: "info" };
                                    const isCritical = slot.severity === "critical";
                                    const isWarning = slot.severity === "warning";
                                    
                                    return (
                                        <div key={i} className={`h-10 border rounded-sm flex items-center justify-center flex-col relative ${isCritical ? 'bg-red-500 border-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10' : isWarning ? 'bg-amber-400 border-amber-500 text-white' : 'bg-white border-zinc-300 text-zinc-400'}`}>
                                            <span className="text-[9px] font-black opacity-80 absolute top-0.5 left-1">Z-{i}</span>
                                            {slot.failCount > 0 && <span className="text-[11px] font-bold mt-2">{slot.failCount}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="w-full max-w-[140px] h-1.5 bg-zinc-300 mt-2 rounded-full"></div>
                        </div>
                        
                        {/* 우측: 6-6 API AI 히트맵 분석 내용 바인딩 */}
                        <div className="col-span-3 flex flex-col justify-center space-y-3">
                            <div className="bg-zinc-900 text-white p-4 rounded-sm">
                                <p className="text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">AI Pattern Recognition</p>
                                <p className="text-sm font-black">{safeHeatmapData.aiAnalysis.title}</p>
                            </div>
                            <div className="text-[11px] text-zinc-700 leading-relaxed bg-zinc-50 p-4 border border-zinc-200 font-medium">
                                {safeHeatmapData.aiAnalysis.description}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // [일일/주간 모드] 6-4 API: 공정능력지수(Cpk) 및 치수 산포도
                <div className="mb-10 z-10 animate-in fade-in duration-500">
                    <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-900"></div> 공정능력지수(Cpk) 및 Package Width 산포도
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-6">
                        {/* 좌측: 수치 요약 (6-4 API summary 바인딩) */}
                        <div className="col-span-1 space-y-4">
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                                <p className="text-[10px] font-bold text-zinc-500 mb-1">치수 합격률 (Pass Rate)</p>
                                <p className="text-2xl font-black text-emerald-600">{safeQualityData.summary.passRate}%</p>
                                <p className="text-[10px] text-zinc-500 mt-1">{safeQualityData.summary.passRateSub}</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                                <p className="text-[10px] font-bold text-zinc-500 mb-1">Package Width Cpk</p>
                                <p className="text-2xl font-black text-zinc-900">{safeQualityData.summary.cpk}</p>
                                <p className="text-[10px] text-zinc-500 mt-1">{safeQualityData.summary.cpkSub}</p>
                            </div>
                        </div>

                        {/* 우측: 6-4 API 히스토그램 동적 렌더링 */}
                        <div className="col-span-2 border border-zinc-200 p-4 flex flex-col justify-end relative h-50 rounded-sm bg-white">
                            <div className="absolute inset-0 flex justify-between px-8 py-4 pointer-events-none">
                                <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">LSL ({safeQualityData.distributionChart.guidelines.lsl})</span></div>
                                <div className="h-full w-px border-l-2 border-emerald-500/30 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-emerald-600 font-bold">Target ({safeQualityData.distributionChart.guidelines.target})</span></div>
                                <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">USL ({safeQualityData.distributionChart.guidelines.usl})</span></div>
                            </div>
                            
                            <div className="flex items-end justify-center gap-2 h-32 px-12 z-10">
                                {safeQualityData.distributionChart.histogram.map((bar, i) => {
                                    // 가장 높은 막대 기준으로 퍼센트 계산 (차트 높이 조절용)
                                    const maxCount = Math.max(...safeQualityData.distributionChart.histogram.map(h => h.count));
                                    const heightPercent = (bar.count / maxCount) * 100;
                                    
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center group">
                                            <div 
                                                className={`w-full rounded-t-sm transition-all ${bar.isWarning ? 'bg-amber-400' : 'bg-zinc-800'}`} 
                                                style={{ height: `${heightPercent}%` }}
                                            />
                                            <span className="text-[8px] text-zinc-400 mt-1 scale-90 whitespace-nowrap">{bar.range}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="w-full text-center text-[10px] text-zinc-500 mt-3 font-medium">Package Width (mm) 측정 분포</div>
                        </div>
                    </div>

                    {/* 6-4 API AI 치수 원인 추론 박스 바인딩 */}
                    {safeQualityData.aiInference.hasAlert && (
                        <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
                            <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> {safeQualityData.aiInference.title}
                            </h4>
                            <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                                {safeQualityData.aiInference.description}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* 2. 주요 불량 분석 파레토 (6-3 API defectStatsData 바인딩 - 기존 코드 유지) */}
            <div className="mb-auto z-10 mt-4">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> {reportMode === 'equipment' ? `${targetEq} 주요 불량 유형 파레토` : '라인 주요 불량 유형 파레토 (Defect Pareto)'}
                </h3>

                    <div className="space-y-3 mb-6 bg-zinc-50 p-5 border border-zinc-200 rounded-sm">
                        {safeDefectData.map((defect, idx) => (
                            <div key={defect.code} className="flex items-center gap-3">
                                <div className="w-24 text-[10px] font-bold text-right truncate text-zinc-700">{defect.name}</div>
                                <div className="flex-1 h-4 bg-zinc-200 rounded-sm overflow-hidden flex">
                                    <div className={`h-full flex items-center px-2 text-[9px] font-bold text-white transition-all duration-1000 ${idx === 0 ? 'bg-zinc-900' : 'bg-zinc-400'}`} style={{ width: defect.ratio }}>
                                        {defect.ratio}
                                    </div>
                                </div>
                                <div className="w-12 text-[10px] text-zinc-600 text-right">{defect.count}건</div>
                            </div>
                        ))}
                    </div>
    
                    <table className="w-full text-[11px] border-collapse bg-white">
                        <thead>
                            <tr className="border-y-2 border-zinc-900 bg-zinc-50">
                                <th className="py-2.5 px-3 text-left w-16 text-zinc-600">코드</th>
                                <th className="py-2.5 px-3 text-left text-zinc-600">불량명</th>
                                <th className="py-2.5 px-3 text-center w-20 text-zinc-600">구분</th>
                                <th className="py-2.5 px-3 text-left text-zinc-600">품질 영향도 및 예상 문제 현상</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {safeDefectData.map((defect) => (
                                <tr key={defect.code} className="hover:bg-zinc-50 transition-colors">
                                    <td className="py-3 px-3 font-bold text-zinc-900">{defect.code}</td>
                                    <td className="py-3 px-3 font-medium text-zinc-700">{defect.name}</td>
                                    <td className="py-3 px-3 text-center">
                                        <span className={`px-1.5 py-0.5 border rounded-sm text-[9px] font-bold ${defect.type === '공통 불량' ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-zinc-200 text-zinc-500 bg-zinc-50'}`}>
                                            {defect.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-zinc-600">{defect.impact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            <div className="mt-auto pt-10 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-100 z-10">
                <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
                <p className="font-bold text-zinc-500">Page 02</p>
            </div>
        </div>

        {/* ========================================== */}
        {/* 📄 리포트 3페이지 (가동 이력 및 Action Plan) */}
        {/* ========================================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden mt-8 transition-all">
            
            {/* 🌟 로딩 중 블러 효과 */}
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="animate-pulse font-bold text-zinc-400 text-xl tracking-widest">UPDATING REPORT...</div>
                </div>
            )}

            <div className="absolute top-[40%] left-[-10%] w-[120%] -rotate-45 text-[120px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>

            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none z-0">
                <Settings2 className="w-64 h-64 text-zinc-900" />
            </div>

            <div className="mb-8 z-10">
                <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                    <span className="text-zinc-400 font-normal">03.</span> 
                    {reportMode === 'equipment' ? `${targetEq} 상세 가동 이력 및 조치 현황` : '종합 설비 가동 이력 및 조치 현황'}
                </h2>
            </div>

            {/* 1. 종합 가동 시간 (Timeline & KPI 동적 바인딩) */}
            <div className="mb-10 z-10">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 
                    {reportMode === 'equipment' ? '대상 장비 가동 지표 요약' : '라인 전체 가동 지표 요약'}
                </h3>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">총 가동 시간 (Run)</p>
                        <p className="text-lg font-black text-zinc-900">
                            {safeReportData.operationTimeline.runHour}<span className="text-xs font-normal text-zinc-500 ml-1">hr</span>
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-red-500 mb-1">총 비가동 (Down)</p>
                        <p className="text-lg font-black text-red-600">
                            {safeReportData.operationTimeline.downHour}<span className="text-xs font-normal text-red-400 ml-1">hr</span>
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">MTBF (평균무고장)</p>
                        <p className="text-lg font-black text-zinc-900">
                            {safeReportData.operationTimeline.mtbf}<span className="text-xs font-normal text-zinc-500 ml-1">hr</span>
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">UPH (시간당생산)</p>
                        <p className="text-lg font-black text-emerald-600">
                            {safeReportData.operationTimeline.uph.toLocaleString()}<span className="text-xs font-normal text-emerald-500/70 ml-1">ea</span>
                        </p>
                    </div>
                </div>

                {/* 🌟 타임라인 바 (API 데이터 기반 동적 렌더링) */}
                <div className="border border-zinc-200 p-4 rounded-sm bg-white">
                    <p className="text-[10px] font-bold text-zinc-500 mb-2">
                        {reportMode === 'weekly' ? '주간 가동 타임라인 (누적 비율)' : '당일 가동 타임라인 (08:00 기준)'}
                    </p>
                    <div className="h-6 flex rounded-sm overflow-hidden mb-2">
                        {safeReportData.operationTimeline.timeline.map((segment, idx) => {
                            // 상태에 따른 색상 매핑
                            const colorClass = segment.status === "run" ? "bg-emerald-500" : 
                                               segment.status === "error" ? "bg-red-500" : "bg-amber-400";
                            return (
                                <div 
                                    key={idx} 
                                    className={`${colorClass} h-full`} 
                                    style={{ width: `${segment.ratio}%` }} 
                                    title={`${segment.status.toUpperCase()} (${segment.start} ~ ${segment.end})`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold px-1">
                        {/* 배열의 시작과 끝 시간 위주로만 표시 */}
                        <span>{safeReportData.operationTimeline.timeline[0]?.start || "08:00"}</span>
                        <span>{safeReportData.operationTimeline.timeline[safeReportData.operationTimeline.timeline.length - 1]?.end || "17:00"}</span>
                    </div>
                </div>
            </div>

            {/* 2. 경보 및 조치 현황 표 (6-5 API 데이터 바인딩) */}
            <div className="mb-10 z-10 flex-1">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 경보 발생 및 조치 현황 
                    <span className="text-[10px] font-normal text-zinc-500 ml-2">({safeAlarmData.length}건 검색됨)</span>
                </h3>
                
                <table className="w-full text-[10px] border-collapse bg-white">
                    <thead>
                        <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-left">
                            <th className="py-2.5 px-3 w-14 text-zinc-600">심각도</th>
                            <th className="py-2.5 px-3 w-16 text-zinc-600">발생 시각</th>
                            <th className="py-2.5 px-3 w-20 text-zinc-600">장비 ID</th>
                            <th className="py-2.5 px-3 text-zinc-600">경보 내용</th>
                            <th className="py-2.5 px-3 w-16 text-center text-zinc-600">상태</th>
                            <th className="py-2.5 px-3 w-40 text-zinc-600">조치 내역 (작업자)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                        {safeAlarmData.length > 0 ? (
                            safeAlarmData.map((alarm) => (
                                <tr key={alarm.id} className={`hover:bg-zinc-50 transition-colors ${alarm.status === "미조치" ? "bg-red-50/30" : ""}`}>
                                    <td className="py-3 px-3">
                                        <span className={`font-black uppercase ${alarm.severity === 'critical' ? 'text-red-600' : 'text-amber-500'}`}>
                                            {alarm.severity}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-zinc-500 font-medium">{alarm.time}</td>
                                    <td className="py-3 px-3 font-bold text-zinc-900">{alarm.eq}</td>
                                    <td className="py-3 px-3 text-zinc-700">{alarm.message}</td>
                                    <td className="py-3 px-3 text-center">
                                        {alarm.status === "미조치" ? (
                                            <span className="bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold">미조치</span>
                                        ) : (
                                            <span className="border border-emerald-500 text-emerald-600 px-2 py-0.5 rounded-sm font-bold bg-emerald-50">{alarm.status}</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 text-zinc-600">
                                        {alarm.action} {alarm.worker && alarm.worker !== "-" && <span className="text-[9px] text-zinc-400 ml-1">({alarm.worker})</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-zinc-400 font-bold bg-zinc-50 border-dashed border-b border-zinc-200">
                                    해당 조건에 부합하는 경보 이력이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🌟 3. AI 추천 익일 Action Plan (6-1 API 데이터 동적 렌더링) */}
            <div className="mb-auto z-10">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> AI 추천 익일 Action Plan (우선순위)
                </h3>
                
                <div className="border-2 border-zinc-900 p-6 space-y-5 relative bg-white">
                    <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1">
                        AI PREDICTION
                    </div>
                    
                    {safeReportData.actionPlans.length > 0 ? (
                        safeReportData.actionPlans.map((plan, idx) => (
                            <div key={idx}>
                                <div className="flex gap-4 items-start">
                                    <div className={`${plan.isCritical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'} text-xs font-black px-2 py-1 shrink-0 mt-0.5`}>
                                        Priority {plan.priority}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-900 mb-1">{plan.title}</h4>
                                        <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                                            {plan.description}
                                        </p>
                                    </div>
                                </div>
                                {/* 마지막 항목이 아니면 구분선 표시 */}
                                {idx < safeReportData.actionPlans.length - 1 && (
                                    <div className="w-full h-px bg-zinc-200 mt-5"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-xs text-zinc-500 py-4 font-bold">현재 특이사항이 없어 추천된 Action Plan이 없습니다. 정기 예방 정비 스케줄을 준수하십시오.</div>
                    )}
                </div>
            </div>

            {/* 하단 푸터 */}
            <div className="mt-10 pt-6 flex justify-between items-end border-t border-zinc-200 z-10">
                <div className="text-[10px] text-zinc-400 space-y-1.5">
                    <p className="font-bold text-zinc-700">© 2026 SMART LINK Vision Inspection Systems</p>
                    <p>본 문서는 AI 시스템에 의해 1차 분석 및 취합된 <strong>[데이터 요약 초안]</strong>입니다.</p>
                    <p>정식 결재 및 이관 시에는 사내 표준 양식으로 데이터를 변환하여 사용하십시오.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 mb-4">자동 생성 승인표</p>
                    <div className="flex items-center gap-4 text-sm font-bold text-zinc-900">
                        <span className="text-zinc-400 font-normal text-[11px]">발행자</span>
                        <span>Smart Link AI</span>
                        <span className="border border-zinc-900 text-[10px] px-2 py-0.5 rounded-full rotate-[-10deg] text-red-600">AUTO</span>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}