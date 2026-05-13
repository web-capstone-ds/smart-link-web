import React, { useState } from "react"
import { Printer, Download, Cpu, Activity, AlertTriangle, Settings2, CheckCircle2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

const equipmentComparisonData = [
    { id: "SAW-EQ.01", recipe: "PKG_A12", uptime: 82.5, total: 24500, fail: 850, marginal: 320, yield: "95.2%", majorDefect: "C-01 (Chipping)", unresolvedAlert: true },
    { id: "SAW-EQ.02", recipe: "PKG_B08", uptime: 91.2, total: 22100, fail: 410, marginal: 150, yield: "97.4%", majorDefect: "L-03 (Contamination)", unresolvedAlert: false },
    { id: "SAW-EQ.03", recipe: "PKG_A12", uptime: 98.5, total: 25600, fail: 120, marginal: 50, yield: "99.3%", majorDefect: "B-02 (Blade Wear)", unresolvedAlert: false },
    { id: "SAW-EQ.04", recipe: "PKG_C15", uptime: 99.1, total: 23800, fail: 95, marginal: 30, yield: "99.4%", majorDefect: "-", unresolvedAlert: false },
    { id: "SAW-EQ.05", recipe: "PKG_A12", uptime: 78.0, total: 21500, fail: 950, marginal: 420, yield: "93.6%", majorDefect: "C-01 (Chipping)", unresolvedAlert: true },
];

const defectStatsData = [
    { code: "C-01", name: "Chipping (치핑)", type: "공통 불량", count: 342, ratio: "45%", impact: "Package Size (Width/Height) 이상치 발생" },
    { code: "B-02", name: "Blade Wear (블레이드 마모)", type: "공통 불량", count: 185, ratio: "24%", impact: "절단면 품질 저하 및 부하 증가" },
    { code: "L-03", name: "Lens Contamination", type: "개별 불량", count: 89, ratio: "12%", impact: "비전 인식 오류 (False Alarm)" },
    { code: "A-04", name: "Alignment Fail", type: "개별 불량", count: 45, ratio: "6%", impact: "자재 정렬 틀어짐" },
];

const alarmHistoryData = [
    { id: "A-001", severity: "Critical", eq: "SAW-EQ.01", message: "Package Width USL 초과 위험", time: "14:23:10", status: "미조치", action: "-", worker: "-" },
    { id: "A-002", severity: "Warning", eq: "SAW-EQ.05", message: "Vision Sensor 조명 광도 저하", time: "11:05:42", status: "조치완료", action: "광원 캘리브레이션 재수행", worker: "김엔지" },
    { id: "A-003", severity: "Critical", eq: "SAW-EQ.02", message: "Alignment Fail (연속 3회)", time: "09:12:05", status: "조치완료", action: "자재 매거진 재정렬 및 영점 조정", worker: "이프로" },
    { id: "A-004", severity: "Warning", eq: "SAW-EQ.08", message: "Network Sync Timeout", time: "08:45:11", status: "조치완료", action: "버퍼 초기화 및 재접속", worker: "시스템" },
];

export function DailyReport() { // ***** 수정해야함 리포트.
    const [reportMode, setReportMode] = useState<"daily" | "weekly" | "equipment">("daily");
    const [targetEq, setTargetEq] = useState("SAW-EQ.01")

    // 동적 텍스트 및 데이터 필터링 로직
    const reportTitle = reportMode === "daily" ? "DAILY REPORT" : reportMode === "weekly" ? "WEEKLY SUMMARY" : "EQUIPMENT DETAIL";
    const reportSubtitle = reportMode === "daily" ? "일일 공정 분석 리포트" : reportMode === "weekly" ? "주간 데이터 요약 리포트" : `${targetEq} 상세 분석 리포트`;
    const periodText = reportMode === "daily" ? "2026.05.06 08:00 ~ 17:00" : reportMode === "weekly" ? "2026.05.01 ~ 05.06 (1주차)" : "최근 24시간 누적";
    
    // 알람 이력 필터링 (장비별 리포트일 경우 해당 장비만 표시)
    const filteredAlarms = reportMode === "equipment" 
        ? alarmHistoryData.filter(a => a.eq === targetEq)
        : alarmHistoryData;

    // AI 동적 메시지
    const aiMessage = reportMode === "daily" 
        ? `금일 주간 가동 결과, 전체 생산량은 목표 대비 102.4%로 초과 달성되었습니다. 다만, SAW-EQ.01 장비에서 패키지 치수 편차가 USL 한계치(12.04mm)에 도달하는 징후가 포착되어 야간 조 교대 시 즉각적인 교체를 권고합니다.`
        : reportMode === "weekly"
        ? `주간 누적 수율은 98.2%로 양호한 흐름이나, 공통 불량인 Chipping(45%)의 비중이 전주 대비 3% 증가했습니다. 칩핑 유발의 주요 원인인 블레이드 교체 주기(MTBF)를 10% 단축하는 테스트를 제안합니다.`
        : `${targetEq} 장비의 현재 수율은 ${equipmentComparisonData.find(e => e.id === targetEq)?.yield || 'N/A'}이며, 미조치된 Critical 알람이 존재합니다. 해당 장비의 치수(Width) 편차가 관리 상한선으로 쏠리고 있어 즉각적인 Z축 보정이 필요합니다.`;
    
    return (
        <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500 pb-20 bg-muted/30 pt-8">
        
        {/* 🌟 상단 툴바 (인쇄 시 숨김 처리: print:hidden) */}
        <div className="w-[210mm] flex flex-col gap-4 bg-card p-4 rounded-lg border border-border shadow-sm print:hidden">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted-foreground" /> 리포트 컨트롤 패널
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">인쇄용 데이터 요약 초안(Draft) 생성기</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="w-4 h-4" /> 초안 인쇄
                    </Button>
                    <Button size="sm" className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
                        <Download className="w-4 h-4" /> PDF 내보내기
                    </Button>
                </div>
            </div>

            {/* 필터 옵션 */}
            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                    <button 
                        onClick={() => setReportMode("daily")} 
                        className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-colors ${reportMode === 'daily' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        일일 리포트
                    </button>
                    <button 
                        onClick={() => setReportMode("weekly")} 
                        className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-colors ${reportMode === 'weekly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        주간 리포트
                    </button>
                    <button 
                        onClick={() => setReportMode("equipment")} 
                        className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-colors ${reportMode === 'equipment' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        장비별 리포트
                    </button>
                </div>

                {reportMode === "equipment" && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <span className="text-xs font-bold text-muted-foreground">대상 장비:</span>
                        <select 
                            value={targetEq} 
                            onChange={(e) => setTargetEq(e.target.value)}
                            className="text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            {equipmentComparisonData.map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.id}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>

       {/* ========================================== */}
        {/* 📄 리포트 1페이지 (A4 비율: 210mm x 297mm) */}
        {/* ========================================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
            
            {/* 🌟 DRAFT 워터마크 (인쇄 시에도 초안임을 명시) */}
            <div className="absolute top-[40%] left-[-10%] w-[120%] -rotate-45 text-[120px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>
            
            {/* 1. 헤더 & 결재란 */}
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-2">{reportTitle}</h1>
                    <p className="text-sm font-bold text-zinc-500 mb-4">{reportSubtitle}</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-zinc-600">
                        <p><span className="font-bold text-zinc-400 mr-2">발행 일시:</span> 2026. 05. 06 17:00</p>
                        <p><span className="font-bold text-zinc-400 mr-2">작성자:</span> 시스템 자동 생성 (초안)</p>
                        <p><span className="font-bold text-zinc-400 mr-2">집계 기간:</span> {periodText}</p>
                        <p><span className="font-bold text-zinc-400 mr-2">대상:</span> {reportMode === 'equipment' ? targetEq : 'SAW-LINE A 전체'}</p>
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

            {/* 2. AI 상태 요약 (핵심 메시지 - 모드별 동적 텍스트 적용) */}
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
                        {aiMessage}
                    </p>
                </div>
            </div>

            {/* 🌟 3. 핵심 요약 지표 (모드별 동적 데이터 바인딩) */}
            <div className="grid grid-cols-3 gap-4 mb-8 z-10">
                {[
                    { 
                        label: reportMode === 'weekly' ? "누적 생산량" : "총 생산량", 
                        value: reportMode === 'weekly' ? "145,210 EA" : "24,563 EA", 
                        sub: "102.4%", trend: "+2.1%", trendColor: "text-emerald-600" 
                    },
                    { 
                        label: "종합 수율 (Yield)", 
                        value: reportMode === 'equipment' ? (equipmentComparisonData.find(e => e.id === targetEq)?.yield || 'N/A') : "98.7%", 
                        sub: "목표 98.0%", trend: "+0.7%", trendColor: "text-emerald-600" 
                    },
                    { 
                        label: "공정능력지수 (Cpk)", 
                        value: reportMode === 'equipment' && targetEq === 'SAW-EQ.01' ? "1.25" : "1.52", 
                        sub: reportMode === 'equipment' && targetEq === 'SAW-EQ.01' ? "Grade: Warning" : "Grade: Excellent", 
                        trend: "-0.04", trendColor: "text-red-500" 
                    },
                    { 
                        label: "설비종합효율 (OEE)", 
                        value: reportMode === 'equipment' ? `${equipmentComparisonData.find(e => e.id === targetEq)?.uptime || 0}%` : "87.3%", 
                        sub: "전일 85.1%", trend: "+2.2%", trendColor: "text-emerald-600" 
                    },
                    { 
                        label: "비가동 요인 경보", 
                        value: `${filteredAlarms.length} 건`, 
                        sub: "현재 기준", 
                        trend: filteredAlarms.some(a => a.status === '미조치') ? "조치필요" : "양호", 
                        trendColor: filteredAlarms.some(a => a.status === '미조치') ? "text-red-600" : "text-emerald-600" 
                    },
                    { 
                        label: "평균 무고장 (MTBF)", 
                        value: "91.6 hr", sub: "라인 평균 수치", trend: "+4.5 hr", trendColor: "text-emerald-600" 
                    },
                ].map((kpi, idx) => (
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

            {/* 🌟 4. 메인 데이터 테이블 (모드에 따라 분기 렌더링) */}
            <div className="mt-2 flex-1 z-10">
                <h3 className="text-xs font-bold text-zinc-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-zinc-900"></div> 
                    {reportMode === 'equipment' ? '대상 장비 스펙 및 결함 서머리' : '장비별 생산 및 조치 현황 (Raw Data)'}
                </h3>
                
                {reportMode !== "equipment" ? (
                    // 일일/주간 모드일 때: 전체 장비 비교 표
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
                            {equipmentComparisonData.map((eq) => (
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
                                    <td className="py-3 px-3 text-right font-black text-zinc-900">{eq.yield}</td>
                                    <td className="py-3 px-3 pl-6 text-zinc-600 font-medium">{eq.majorDefect}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // 장비 모드일 때: 빈 공간을 채워주는 해당 장비 전용 요약 박스
                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-md flex flex-col justify-center">
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                본 페이지는 <span className="font-bold text-zinc-900 bg-zinc-200 px-1">{targetEq}</span> 장비에 대한 특정 기간 내 상세 퍼포먼스 및 불량 내역을 요약한 초안입니다. <br/><br/>
                                해당 장비는 현재 <span className="font-bold text-zinc-900">{equipmentComparisonData.find(e => e.id === targetEq)?.recipe || '-'}</span> 레시피로 가동 중이며, 수율은 <span className="font-bold text-zinc-900">{equipmentComparisonData.find(e => e.id === targetEq)?.yield || '-'}</span>를 기록하고 있습니다. 
                                주요 불량 요인으로는 <span className="font-bold text-red-600">{equipmentComparisonData.find(e => e.id === targetEq)?.majorDefect || '-'}</span>이 지목되었습니다.
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

            {/* 하단 푸터 (페이지 번호 등) */}
            <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-200 z-10">
                <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
                <p className="font-bold text-zinc-500">Page 01 / 03</p>
            </div>
        </div>
{/* ========================================== */}
        {/* 📄 리포트 2페이지 (품질 및 치수 분석) */}
        {/* ========================================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
            
            {/* 🌟 DRAFT 워터마크 */}
            <div className="absolute top-[40%] left-[-10%] w-[120%] -rotate-45 text-[120px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>

            {/* 우측 상단 배경 아이콘 */}
            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none z-0">
                <Activity className="w-64 h-64 text-zinc-900" />
            </div>

            {/* 페이지 타이틀 (모드별 동적 변경) */}
            <div className="mb-8 z-10">
                <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                    <span className="text-zinc-400 font-normal">02.</span> 
                    {reportMode === 'equipment' ? `${targetEq} 품질 및 결함 정밀 분석` : '품질 및 치수 상세 분석'}
                </h2>
            </div>

            {/* 🌟 상단 섹션 분기: 장비 모드(히트맵) vs 전체 모드(Cpk 산포도) */}
            {reportMode === "equipment" ? (
                // [장비별 모드] 웨이퍼 결함 히트맵 및 AI 분석
                <div className="mb-10 z-10 animate-in fade-in duration-500">
                    <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-900"></div> 불량 발생 위치 시각화 (Wafer Defect Heatmap)
                    </h3>
                    
                    <div className="grid grid-cols-5 gap-6">
                        {/* 좌측: 히트맵 시각화 */}
                        <div className="col-span-2 flex items-center justify-center bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                            <div className="relative w-40 h-40 rounded-full border-2 border-zinc-300 bg-white overflow-hidden shadow-inner flex items-center justify-center">
                                {/* 다이 격자 무늬 */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#71717a 1px, transparent 1px), linear-gradient(90deg, #71717a 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                {/* 플랫존 */}
                                <div className="absolute bottom-0 w-24 h-2 bg-zinc-50 border-t-2 border-zinc-300"></div>
                                
                                {/* 타겟 장비에 따른 열화상 위치 변동 */}
                                {targetEq === 'SAW-EQ.01' || targetEq === 'SAW-EQ.05' ? (
                                    <div className="absolute w-24 h-24 bg-red-500/60 rounded-full blur-xl animate-pulse" style={{ left: '50%', top: '50%' }}></div>
                                ) : (
                                    <div className="absolute w-12 h-12 bg-amber-400/50 rounded-full blur-lg" style={{ left: '30%', top: '40%' }}></div>
                                )}
                            </div>
                        </div>
                        
                        {/* 우측: AI 히트맵 분석 내용 */}
                        <div className="col-span-3 flex flex-col justify-center space-y-3">
                            <div className="bg-zinc-900 text-white p-4 rounded-sm">
                                <p className="text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">AI Pattern Recognition</p>
                                <p className="text-sm font-black">
                                    {targetEq === 'SAW-EQ.01' || targetEq === 'SAW-EQ.05' ? '우측 하단 집중 치핑(Chipping) 패턴 감지' : '산발적 비전 인식 노이즈 감지'}
                                </p>
                            </div>
                            <div className="text-[11px] text-zinc-700 leading-relaxed bg-zinc-50 p-4 border border-zinc-200">
                                {targetEq === 'SAW-EQ.01' || targetEq === 'SAW-EQ.05' 
                                    ? <span>비전 검사 데이터 좌표 매핑 결과, 웨이퍼의 <strong>4시~5시 방향(Edge 영역)</strong>에 결함이 집중되어 있습니다. 이는 대상 설비의 <strong>블레이드 장력 저하 및 Z축 미세 진동</strong>으로 인한 전형적인 물리적 파손 패턴으로 추정됩니다.</span>
                                    : <span>현재 결함 좌표 분포에서 특정한 군집 패턴이 발견되지 않았습니다. 주로 자재 표면의 미세 이물질(Contamination)로 인한 산발적 비전 인식 오류일 확률이 높습니다.</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // [일일/주간 모드] 기존 공정능력지수(Cpk) 및 치수 산포도
                <div className="mb-10 z-10 animate-in fade-in duration-500">
                    <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-900"></div> 공정능력지수(Cpk) 및 Package Width 산포도
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-6">
                        {/* 좌측: 수치 요약 */}
                        <div className="col-span-1 space-y-4">
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                                <p className="text-[10px] font-bold text-zinc-500 mb-1">치수 합격률 (Pass Rate)</p>
                                <p className="text-2xl font-black text-emerald-600">99.2%</p>
                                <p className="text-[10px] text-zinc-500 mt-1">목표 99.0% (초과 달성)</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                                <p className="text-[10px] font-bold text-zinc-500 mb-1">Package Width Cpk</p>
                                <p className="text-2xl font-black text-zinc-900">1.38</p>
                                <p className="text-[10px] text-zinc-500 mt-1">상한계(USL) 방향 편차 발생 중</p>
                            </div>
                        </div>

                        {/* 우측: 정규분포(Bell Curve) 막대그래프 */}
                        <div className="col-span-2 border border-zinc-200 p-4 flex flex-col justify-end relative h-50 rounded-sm bg-white">
                            <div className="absolute inset-0 flex justify-between px-8 py-4 pointer-events-none">
                                <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">LSL</span></div>
                                <div className="h-full w-px border-l-2 border-emerald-500/30 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-emerald-600 font-bold">Target</span></div>
                                <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">USL</span></div>
                            </div>
                            
                            <div className="flex items-end justify-center gap-1 h-32 px-12 z-10">
                                {[10, 15, 25, 45, 75, 100, 85, 55, 30, 15, 8].map((height, i) => (
                                    <div key={i} className={`w-full rounded-t-sm ${i > 7 ? 'bg-amber-400' : 'bg-zinc-800'}`} style={{ height: `${height}%` }}></div>
                                ))}
                            </div>
                            <div className="w-full text-center text-[10px] text-zinc-500 mt-2 font-medium">Package Width (mm) 측정 분포</div>
                        </div>
                    </div>

                    {/* AI 치수 원인 추론 박스 */}
                    <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-4">
                        <h4 className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> AI 치수 이상 원인 추론
                        </h4>
                        <p className="text-[11px] text-amber-900 leading-relaxed">
                            분석 결과, 현재 생산 중인 LOT의 절단 폭(Width) 데이터가 타겟 중앙값에서 <span className="font-bold">상한계(USL) 측으로 지속 이동(+0.02mm)</span>하고 있습니다. 
                            동일 라인의 과거 학습 데이터와 매칭 시, 이는 <span className="font-bold underline">블레이드(Blade) 마모로 인한 절단 저항 증가 패턴과 88% 일치</span>합니다. 즉각적인 블레이드 상태 확인을 요합니다.
                        </p>
                    </div>
                </div>
            )}

            {/* 2. 주요 불량 분석 파레토 (공통 렌더링) */}
            <div className="mb-auto z-10 mt-4">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> {reportMode === 'equipment' ? `${targetEq} 주요 불량 유형 파레토` : '라인 주요 불량 유형 파레토 (Defect Pareto)'}
                </h3>
                
                <div className="space-y-3 mb-6 bg-zinc-50 p-5 border border-zinc-200 rounded-sm">
                    {defectStatsData.map((defect, idx) => (
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
                        {defectStatsData.map((defect) => (
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

            {/* 하단 푸터 */}
            <div className="mt-auto pt-10 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-100 z-10">
                <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
                <p className="font-bold text-zinc-500">Page 02 / 03</p>
            </div>
        </div>
{/* ========================================== */}
        {/* 📄 리포트 3페이지 (가동 이력 및 Action Plan) */}
        {/* ========================================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
            
            {/* 🌟 DRAFT 워터마크 */}
            <div className="absolute top-[40%] left-[-10%] w-[120%] -rotate-45 text-[120px] font-black text-zinc-100/50 pointer-events-none select-none flex justify-center items-center z-0">
                DRAFT SUMMARY
            </div>

            {/* 우측 상단 배경 아이콘 */}
            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none z-0">
                <Settings2 className="w-64 h-64 text-zinc-900" />
            </div>

            {/* 페이지 타이틀 */}
            <div className="mb-8 z-10">
                <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                    <span className="text-zinc-400 font-normal">03.</span> 
                    {reportMode === 'equipment' ? `${targetEq} 상세 가동 이력 및 조치 현황` : '종합 설비 가동 이력 및 조치 현황'}
                </h2>
            </div>

            {/* 1. 종합 가동 시간 (Timeline & OEE) */}
            <div className="mb-10 z-10">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 
                    {reportMode === 'equipment' ? '대상 장비 가동 지표 요약' : '라인 전체 가동 지표 요약'}
                </h3>
                
                {/* 가동 지표 요약 (모드에 따라 수치 가변 렌더링) */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">총 가동 시간 (Run)</p>
                        <p className="text-lg font-black text-zinc-900">
                            {reportMode === 'equipment' ? '21.5' : '102.5'}<span className="text-xs font-normal text-zinc-500 ml-1">hr</span>
                        </p>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-red-500 mb-1">총 비가동 (Down)</p>
                        <p className="text-lg font-black text-red-600">
                            {reportMode === 'equipment' ? '0.8' : '3.2'}<span className="text-xs font-normal text-red-400 ml-1">hr</span>
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">MTBF (평균무고장)</p>
                        <p className="text-lg font-black text-zinc-900">
                            {reportMode === 'equipment' ? (targetEq === 'SAW-EQ.01' ? '24.5' : '112.0') : '42.5'}<span className="text-xs font-normal text-zinc-500 ml-1">hr</span>
                        </p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-200 p-3 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">UPH (시간당생산)</p>
                        <p className="text-lg font-black text-emerald-600">
                            {reportMode === 'equipment' ? '320' : '2,850'}<span className="text-xs font-normal text-emerald-500/70 ml-1">ea</span>
                        </p>
                    </div>
                </div>

                {/* 타임라인 시각화 바 */}
                <div className="border border-zinc-200 p-4 rounded-sm bg-white">
                    <p className="text-[10px] font-bold text-zinc-500 mb-2">
                        {reportMode === 'weekly' ? '주간 가동 비율 추이' : '당일 가동 타임라인 (08:00 ~ 17:00)'}
                    </p>
                    <div className="h-6 flex rounded-sm overflow-hidden mb-2">
                        <div className="bg-emerald-500 h-full w-[20%]" title="Run"></div>
                        <div className="bg-amber-400 h-full w-[5%]" title="Idle"></div>
                        <div className="bg-emerald-500 h-full w-[35%]" title="Run"></div>
                        {reportMode === 'equipment' && targetEq !== 'SAW-EQ.01' ? (
                            <div className="bg-emerald-500 h-full w-[8%]"></div>
                        ) : (
                            <div className="bg-red-500 h-full w-[8%]" title="Stop"></div>
                        )}
                        <div className="bg-emerald-500 h-full w-[32%]" title="Run"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                        <span>08:00</span>
                        <span>10:00</span>
                        <span>12:00</span>
                        <span>14:00</span>
                        <span>17:00</span>
                    </div>
                </div>
            </div>

            {/* 2. 경보 및 조치 현황 표 (동적 필터링 적용) */}
            <div className="mb-10 z-10 flex-1">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> 경보 발생 및 조치 현황 
                    <span className="text-[10px] font-normal text-zinc-500 ml-2">({filteredAlarms.length}건 검색됨)</span>
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
                        {filteredAlarms.length > 0 ? (
                            filteredAlarms.map((alarm) => (
                                <tr key={alarm.id} className={`hover:bg-zinc-50 transition-colors ${alarm.status === "미조치" ? "bg-red-50/30" : ""}`}>
                                    <td className="py-3 px-3">
                                        <span className={`font-black ${alarm.severity === 'Critical' ? 'text-red-600' : 'text-amber-500'}`}>
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
                                            <span className="border border-emerald-500 text-emerald-600 px-2 py-0.5 rounded-sm font-bold bg-emerald-50">조치완료</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-3 text-zinc-600">
                                        {alarm.action} {alarm.worker !== "-" && <span className="text-[9px] text-zinc-400 ml-1">({alarm.worker})</span>}
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

            {/* 3. AI 내일의 권고 (Action Plan) - 조건부 렌더링 */}
            <div className="mb-auto z-10">
                <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-zinc-900"></div> AI 추천 익일 Action Plan (우선순위)
                </h3>
                
                <div className="border-2 border-zinc-900 p-6 space-y-5 relative bg-white">
                    <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1">
                        AI PREDICTION
                    </div>
                    
                    {reportMode === 'equipment' ? (
                        // 장비별 모드 Action Plan
                        <div className="flex gap-4 items-start">
                            <div className={`${targetEq === 'SAW-EQ.01' || targetEq === 'SAW-EQ.05' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'} text-xs font-black px-2 py-1 shrink-0 mt-0.5`}>
                                Action 1
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-zinc-900 mb-1">
                                    {targetEq === 'SAW-EQ.01' || targetEq === 'SAW-EQ.05' ? `${targetEq} 스핀들 블레이드 즉시 교체 및 영점 세팅` : `${targetEq} 정기 예방 정비(PM) 일정 유지`}
                                </h4>
                                <p className="text-[11px] text-zinc-600 leading-relaxed">
                                    {targetEq === 'SAW-EQ.01' || targetEq === 'SAW-EQ.05' 
                                        ? `현재 마모 패턴으로 보아 방치 시 익일 수율 95% 이하 하락이 예상됩니다. 야간 조 교대 시 반드시 예비품으로 교체 후 작업을 재개하십시오.` 
                                        : `현재 정상적인 수율 범위 내에서 가동 중입니다. 차주 예정된 정기 클리닝 일정만 차질 없이 진행하시기 바랍니다.`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        // 일일/주간 전체 라인 Action Plan (기존 유지)
                        <>
                            <div className="flex gap-4 items-start">
                                <div className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 shrink-0 mt-0.5">Priority 1</div>
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 mb-1">SAW-EQ.01 1번 스핀들 블레이드 즉시 교체</h4>
                                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                                        미조치 경보(A-001) 건과 관련하여, 현재 마모도로 보아 방치 시 익일 수율 하락 리스크가 높습니다. <strong className="text-red-600">야간 조 인수인계 시 최우선 작업으로 지정 요망.</strong>
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-px bg-zinc-200"></div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-1 shrink-0 mt-0.5">Priority 2</div>
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 mb-1">라인 전체 Vision Sensor 렌즈 클리닝</h4>
                                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                                        광도 저하 알람 발생 빈도가 증가하고 있습니다. 미세 분진 누적으로 인한 오탐지 방지를 위해 익일 중 전체 라인 에어 클리닝을 권장합니다.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 하단 푸터 및 서명 (초안 보고서 컨셉에 맞게 텍스트 수정) */}
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
                        <span className="border border-zinc-900 text-[10px] px-2 py-0.5 rounded-full rotate-[-10deg] text-red-600 border-red-600">AUTO</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}