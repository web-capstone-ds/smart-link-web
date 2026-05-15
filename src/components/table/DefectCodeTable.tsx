import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react" // 🌟 로딩 아이콘 추가
import { cn } from "@/lib/utils"

import type { DefectStat } from "@/api/equipment" // 🌟 API 파일에서 타입 가져오기

interface DefectCodeTableProps {
    data: DefectStat[];
    className?: string;
    isLoading?: boolean; // 🌟 로딩 상태 프롭스 추가
}

export function DefectCodeTable({ data = [], className, isLoading }: DefectCodeTableProps) {
    return (
        <Card className={cn("flex flex-col gap-0 shadow-sm border-border min-w-0", className)}>
            <CardHeader className="py-3 px-4 pt-2 border-b border-border">
                <CardTitle className="text-sm font-bold">주요 불량 코드 분석</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="h-9 px-4 py-2 text-xs">코드명</TableHead>
                            <TableHead className="h-9 py-2 text-xs">구분</TableHead>
                            <TableHead className="h-9 py-2 text-xs text-right">발생 (비율)</TableHead>
                            <TableHead className="h-9 py-2 text-xs pl-6">문제 현상 요약</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* 🌟 로딩 중 처리 */}
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-70 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader2 className="w-6 h-6 mb-2 animate-spin text-primary/50" />
                                        <span className="text-sm">불량 데이터를 분석 중입니다...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            /* 🌟 정상 데이터 렌더링 */
                            data.map((defect) => (
                                <TableRow key={defect.code} className="border-border/50">
                                    <TableCell className="px-4 py-2 font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{defect.code}</span>
                                            <span className="text-[10px] text-muted-foreground">{defect.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <Badge variant="outline" className={`text-[9px] font-normal px-1.5 py-0 h-4 ${defect.type === '공통 불량' ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-500'}`}>
                                            {defect.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-bold text-sm">
                                        {defect.count} <span className="text-[10px] text-muted-foreground font-normal">({defect.ratio})</span>
                                    </TableCell>
                                    <TableCell className="py-2 text-[11px] text-muted-foreground pl-6">
                                        {defect.impact}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}