import { Printer, Download, Cpu, Activity, AlertTriangle, Settings2, CheckCircle2 } from "lucide-react"
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
    return (
        <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500 pb-20 bg-muted/30 pt-8">
        
        {/* 상단 툴바 (인쇄/다운로드 버튼) */}
        <div className="w-[210mm] flex justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
            <div>
            <h2 className="text-lg font-bold">일일 공정 분석 리포트</h2>
            <p className="text-xs text-muted-foreground">PDF 내보내기 및 인쇄 최적화 포맷</p>
            </div>
            <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
                <Printer className="w-4 h-4" /> 인쇄
            </Button>
            <Button size="sm" className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
                <Download className="w-4 h-4" /> PDF 저장
            </Button>
            </div>
        </div>

        {/* ========================================== */}
        {/* 📄 리포트 1페이지 (A4 비율: 210mm x 297mm) */}
        {/* ========================================== */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-12 shadow-xl flex flex-col font-sans border border-zinc-200 shrink-0">
            
            {/* 1. 헤더 & 결재란 */}
            <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">DAILY REPORT</h1>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-zinc-600">
                        <p><span className="font-bold text-zinc-400 mr-2">발행 일시:</span> 2026. 05. 06 17:00</p>
                        <p><span className="font-bold text-zinc-400 mr-2">작성자:</span> 홍길동 선임</p>
                        <p><span className="font-bold text-zinc-400 mr-2">집계 기간:</span> 2026.05.06 08:00 ~ 17:00</p>
                        <p><span className="font-bold text-zinc-400 mr-2">대상 설비:</span> SAW-LINE A (12대)</p>
                    </div>
                </div>

                {/* 결재란 */}
                <div className="flex border border-zinc-300 text-center text-[10px]">
                    <div className="w-12 border-r border-zinc-300">
                        <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold">결재</div>
                        <div className="h-16 flex items-center justify-center">작성</div>
                    </div>
                    <div className="w-16 border-r border-zinc-300">
                        <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold">기안</div>
                        <div className="h-16"></div>
                    </div>
                    <div className="w-16 border-r border-zinc-300">
                        <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold">검토</div>
                        <div className="h-16"></div>
                    </div>
                    <div className="w-16">
                        <div className="bg-zinc-100 border-b border-zinc-300 py-1 font-bold">승인</div>
                        <div className="h-16"></div>
                    </div>
                </div>
            </div>

            {/* 2. AI 상태 요약 (핵심 메시지) */}
            <div className="bg-zinc-900 text-white p-6 rounded-md mb-8 relative overflow-hidden print:border print:border-zinc-300 print:bg-white print:text-zinc-900">
                <div className="absolute -right-2.5 -top-2.5 opacity-10 print:opacity-5">
                    <Cpu className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-zinc-400 mb-2 flex items-center gap-2 print:text-zinc-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse print:animate-none"></div>
                        AI EXECUTIVE SUMMARY
                    </h3>
                    <p className="text-sm leading-relaxed font-medium">
                        금일 주간 가동 결과, 전체 생산량은 목표 대비 <span className="text-emerald-400 print:text-emerald-600 font-bold">102.4%</span>로 초과 달성되었습니다. 
                        다만, <span className="text-amber-400 print:text-amber-600 font-bold">SAW-EQ.01</span> 장비에서 패키지 치수(Width) 편차가 USL 한계치(12.04mm)에 도달하는 징후가 포착되었습니다. 
                        이는 블레이드 수명 종료에 따른 현상으로 판단되며, <span className="text-red-400 print:text-red-600 font-bold">야간 조 교대 시 즉각적인 교체</span>를 권고합니다.
                    </p>
                </div>
            </div>

            {/* 🌟 3. 핵심 요약 지표 (TPM & 신뢰성 지표로 업데이트) */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: "총 생산량 / 달성률", value: "24,563 EA", sub: "102.4%", trend: "+2.1%", trendColor: "text-emerald-600" },
                    { label: "종합 수율 (Yield)", value: "98.7%", sub: "목표 98.0%", trend: "+0.7%", trendColor: "text-emerald-600" },
                    { label: "공정능력지수 (Cpk)", value: "1.52", sub: "Grade: Excellent", trend: "-0.04", trendColor: "text-red-500" },
                    { label: "설비종합효율 (OEE)", value: "87.3%", sub: "전일 85.1%", trend: "+2.2%", trendColor: "text-emerald-600" },
                    { label: "총 비가동 시간", value: "12.5 hr", sub: "에러 정지 및 대기", trend: "-1.2 hr", trendColor: "text-emerald-600" },
                    { label: "평균 무고장 (MTBF)", value: "91.6 hr", sub: "라인 평균 수치", trend: "+4.5 hr", trendColor: "text-emerald-600" },
                ].map((kpi, idx) => (
                    <div key={idx} className="border border-zinc-200 p-4 rounded-md bg-zinc-50/50">
                        <p className="text-[10px] font-bold text-zinc-500 mb-1">{kpi.label}</p>
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-black text-zinc-900">{kpi.value}</span>
                            <span className={`text-[10px] font-bold ${kpi.trendColor}`}>{kpi.trend}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* 🌟 4. 장비 개별 수율 비교 표 (레시피 & 조치 상태 추가) */}
            <div className="mt-2 flex-1">
                <h3 className="text-xs font-bold text-zinc-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 bg-zinc-900"></div> 장비별 생산 및 조치 현황
                </h3>
                <table className="w-full text-[11px] border-collapse">
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
            </div>
            {/* 하단 푸터 (페이지 번호 등) */}
            <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-200">
                <p>CONFIDENTIAL © 2026 SMART LINK Vision Inspection Systems</p>
                <p className="font-bold">Page 01 / 03</p>
            </div>
        </div>

        {/* ========================================== */}
        {/* 📄 리포트 2페이지 (품질 및 치수 분석) */}
        {/* ========================================== */}
        <div className="w-200 min-h-283 bg-white text-zinc-950 p-12 shadow-2xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
            
            {/* 우측 상단 워터마크 느낌의 배경 */}
            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none">
            <Activity className="w-64 h-64 text-zinc-900" />
            </div>

            {/* 페이지 타이틀 */}
            <div className="mb-8 z-10">
            <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                <span className="text-zinc-400 font-normal">02.</span> 품질 및 치수 상세 분석
            </h2>
            </div>

            {/* 1. 공정능력지수(Cpk) 및 치수 데이터 */}
            <div className="mb-10 z-10">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-900"></div> 공정능력지수(Cpk) 및 Package Width 산포도
            </h3>
            
            <div className="grid grid-cols-3 gap-6">
                {/* 좌측: 수치 요약 */}
                <div className="col-span-1 space-y-4">
                <div className="bg-zinc-50 border border-zinc-200 p-4">
                    <p className="text-[10px] font-bold text-zinc-500 mb-1">치수 합격률 (Pass Rate)</p>
                    <p className="text-2xl font-black text-emerald-600">99.2%</p>
                    <p className="text-[10px] text-zinc-500 mt-1">목표 99.0% (초과 달성)</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-4">
                    <p className="text-[10px] font-bold text-zinc-500 mb-1">Package Width Cpk</p>
                    <p className="text-2xl font-black text-zinc-900">1.38</p>
                    <p className="text-[10px] text-zinc-500 mt-1">상한계(USL) 방향 편차 발생 중</p>
                </div>
                </div>

                {/* 우측: 정규분포(Bell Curve) 시각화 흉내내기 (Tailwind UI) */}
                <div className="col-span-2 border border-zinc-200 p-4 flex flex-col justify-end relative h-50">
                {/* 타겟 및 USL/LSL 가이드라인 */}
                <div className="absolute inset-0 flex justify-between px-8 py-4 pointer-events-none">
                    <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">LSL</span></div>
                    <div className="h-full w-px border-l-2 border-emerald-500/30 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-emerald-600 font-bold">Target</span></div>
                    <div className="h-full w-px border-l border-dashed border-red-400 relative"><span className="absolute -top-4 -translate-x-1/2 text-[9px] text-red-500 font-bold">USL</span></div>
                </div>
            
                {/* 분포도 막대그래프 (히스토그램 모형) - 우측으로 살짝 쏠린 형상 */}
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
                동일 라인의 과거 학습 데이터와 매칭 시, 이는 <span className="font-bold underline">블레이드(Blade) 마모로 인한 절단 저항 증가 패턴과 88% 일치</span>합니다. 
                즉각적인 블레이드 상태 확인을 요합니다.
                </p>
            </div>
            </div>

            {/* 2. 주요 불량 분석 (파레토 및 테이블) */}
            <div className="mb-auto z-10">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-900"></div> 주요 불량 유형 파레토 (Defect Pareto)
            </h3>
            
            {/* 가로형 막대그래프 (Tailwind로 직접 구현) */}
            <div className="space-y-3 mb-6 bg-zinc-50 p-5 border border-zinc-200">
                {defectStatsData.map((defect, idx) => (
                <div key={defect.code} className="flex items-center gap-3">
                <div className="w-24 text-[10px] font-bold text-right truncate text-zinc-700">{defect.name}</div>
                <div className="flex-1 h-4 bg-zinc-200 rounded-sm overflow-hidden flex">
                    <div className={`h-full flex items-center px-2 text-[9px] font-bold text-white ${idx === 0 ? 'bg-zinc-900' : 'bg-zinc-400'}`} style={{ width: defect.ratio }}>
                    {defect.ratio}
                    </div>
                </div>
                <div className="w-12 text-[10px] text-zinc-600 text-right">{defect.count}건</div>
                </div>
                ))}
            </div>

            {/* 공통/개별 불량 상세 분류 표 */}
            <table className="w-full text-[11px] border-collapse">
                <thead>
                <tr className="border-y-2 border-zinc-900 bg-zinc-50">
                    <th className="py-2 px-3 text-left w-16">코드</th>
                    <th className="py-2 px-3 text-left">불량명</th>
                    <th className="py-2 px-3 text-center w-20">구분</th>
                    <th className="py-2 px-3 text-left">품질 영향도 및 예상 문제 현상</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                {defectStatsData.map((defect) => (
                    <tr key={defect.code}>
                    <td className="py-2.5 px-3 font-bold text-zinc-900">{defect.code}</td>
                    <td className="py-2.5 px-3 font-medium text-zinc-700">{defect.name}</td>
                    <td className="py-2.5 px-3 text-center">
                        <span className={`px-1.5 py-0.5 border text-[9px] ${defect.type === '공통 불량' ? 'border-amber-400 text-amber-700 bg-amber-50' : 'border-zinc-300 text-zinc-600 bg-zinc-50'}`}>
                        {defect.type}
                        </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-600">{defect.impact}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* 하단 푸터 */}
            <div className="mt-auto pt-10 flex justify-between items-center text-[10px] text-zinc-400 border-t border-zinc-100 z-10">
            <p>© 2026 SMART LINK Vision Inspection Systems</p>
            <p>Page 02 / 03</p>
            </div>
        </div>

        {/* ========================================== */}
        {/* 📄 리포트 3페이지 (가동 이력 및 Action Plan) */}
        {/* ========================================== */}
        <div className="w-200 min-h-283 bg-white text-zinc-950 p-12 shadow-2xl flex flex-col font-sans border border-zinc-200 shrink-0 relative overflow-hidden">
            
            {/* 우측 상단 워터마크 */}
            <div className="absolute right-0 top-0 opacity-5 p-8 pointer-events-none">
            <Settings2 className="w-64 h-64 text-zinc-900" />
            </div>

            {/* 페이지 타이틀 */}
            <div className="mb-8 z-10">
            <h2 className="text-2xl font-black text-zinc-900 border-b-2 border-zinc-900 pb-2 flex items-center gap-2">
                <span className="text-zinc-400 font-normal">03.</span> 설비 가동 이력 및 조치 현황
            </h2>
            </div>

            {/* 1. 종합 가동 시간 (Timeline & OEE) */}
            <div className="mb-10 z-10">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-900"></div> 라인 종합 가동 현황
            </h3>
            
            {/* 가동 지표 요약 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-zinc-50 border border-zinc-200 p-3 text-center">
                <p className="text-[10px] font-bold text-zinc-500 mb-1">총 가동 시간</p>
                <p className="text-lg font-black text-zinc-900">102.5<span className="text-xs font-normal text-zinc-500 ml-1">hr</span></p>
                </div>
                <div className="bg-red-50 border border-red-100 p-3 text-center">
                <p className="text-[10px] font-bold text-red-500 mb-1">총 비가동 (Down)</p>
                <p className="text-lg font-black text-red-600">3.2<span className="text-xs font-normal text-red-400 ml-1">hr</span></p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-3 text-center">
                <p className="text-[10px] font-bold text-zinc-500 mb-1">MTBF (평균무고장)</p>
                <p className="text-lg font-black text-zinc-900">42.5<span className="text-xs font-normal text-zinc-500 ml-1">hr</span></p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-3 text-center">
                <p className="text-[10px] font-bold text-zinc-500 mb-1">UPH (시간당생산)</p>
                <p className="text-lg font-black text-emerald-600">2,850<span className="text-xs font-normal text-emerald-500/70 ml-1">ea</span></p>
                </div>
            </div>

            {/* 타임라인 시각화 바 */}
            <div className="border border-zinc-200 p-4">
                <p className="text-[10px] font-bold text-zinc-500 mb-2">주간 가동 타임라인 (08:00 ~ 17:00)</p>
                <div className="h-6 flex rounded-sm overflow-hidden mb-2">
                <div className="bg-emerald-500 h-full w-[20%]" title="Run"></div>
                <div className="bg-amber-400 h-full w-[5%]" title="Idle"></div>
                <div className="bg-emerald-500 h-full w-[35%]" title="Run"></div>
                <div className="bg-red-500 h-full w-[8%]" title="Stop"></div>
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

            {/* 2. 경보 및 조치 현황 표 */}
            <div className="mb-10 z-10">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-900"></div> 경보 발생 및 조치 현황
            </h3>
            
            <table className="w-full text-[10px] border-collapse">
                <thead>
                <tr className="border-y-2 border-zinc-900 bg-zinc-50 text-left">
                    <th className="py-2 px-2 w-14">심각도</th>
                    <th className="py-2 px-2 w-16">발생 시각</th>
                    <th className="py-2 px-2 w-20">장비 ID</th>
                    <th className="py-2 px-2">경보 내용</th>
                    <th className="py-2 px-2 w-14 text-center">상태</th>
                    <th className="py-2 px-2 w-40">조치 내역 (작업자)</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                {alarmHistoryData.map((alarm) => (
                    <tr key={alarm.id} className={alarm.status === "미조치" ? "bg-red-50/50" : ""}>
                        <td className="py-2 px-2">
                            <span className={`font-bold ${alarm.severity === 'Critical' ? 'text-red-600' : 'text-amber-500'}`}>
                            {alarm.severity}
                            </span>
                        </td>
                        <td className="py-2 px-2 text-zinc-500">{alarm.time}</td>
                        <td className="py-2 px-2 font-bold text-zinc-800">{alarm.eq}</td>
                        <td className="py-2 px-2 text-zinc-700">{alarm.message}</td>
                        <td className="py-2 text-center">
                            {alarm.status === "미조치" ? (
                            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-bold">미조치</span>
                            ) : (
                            <span className="border border-emerald-500 text-emerald-600 px-1.5 py-0.5 rounded-sm">조치완료</span>
                            )}
                        </td>
                        <td className="py-2 px-2 text-zinc-600">
                            {alarm.action} {alarm.worker !== "-" && <span className="text-[9px] text-zinc-400">({alarm.worker})</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            {/* 3. AI 내일의 권고 (Action Plan) - 보고서의 결론 */}
            <div className="mb-auto z-10">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-900"></div> AI 추천 익일 Action Plan (우선순위)
            </h3>
            
            <div className="border-2 border-zinc-900 p-6 space-y-4 relative">
                <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1">
                AI PREDICTION
                </div>
                
                <div className="flex gap-4 items-start">
                    <div className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 shrink-0 mt-0.5">Priority 1</div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 mb-1">SAW-EQ.01 1번 스핀들 블레이드 즉시 교체</h4>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                        미조치 경보(A-001) 건과 관련하여, 현재 마모도로 보아 익일 오전 10시경 수율 95% 이하 하락이 92% 확률로 예상됩니다. 
                        <strong className="text-red-600">야간 조 교대 시 반드시 예비품(B-Type)으로 교체 후 영점 세팅을 요합니다.</strong>
                        </p>
                    </div>
                </div>
            
                <div className="w-full h-px bg-zinc-200"></div>
                
                <div className="flex gap-4 items-start">
                    <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-1 shrink-0 mt-0.5">Priority 2</div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-900 mb-1">라인 전체 Vision Sensor 렌즈 클리닝</h4>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                        금일 조명 광도 저하 알람(A-002) 발생 빈도가 전주 대비 15% 증가했습니다. 미세 분진 누적으로 인한 오탐지 방지를 위해 
                        주말 PM(정기보수) 전, 익일 중 전체 라인 렌즈부 에어 클리닝 및 광원 점검을 권장합니다.
                        </p>
                    </div>
                </div>
            </div>
            </div>

            {/* 하단 푸터 및 서명 */}
            <div className="mt-10 pt-6 flex justify-between items-end border-t border-zinc-200 z-10">
            <div className="text-[10px] text-zinc-400 space-y-1">
                <p>© 2026 SMART LINK Vision Inspection Systems</p>
                <p>본 문서는 AI 시스템에 의해 분석 및 생성된 기밀 자료입니다.</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-500 mb-4">위와 같이 일일 공정 현황을 보고합니다.</p>
                <p className="text-sm font-bold text-zinc-900">담당자 : 홍 길 동 (인)</p>
            </div>
            </div>
        </div>
        </div>
    )
}