import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import type { DefectStat } from "@/type/equipmentType"

interface DefectCodeTableProps {
    data: DefectStat[];
    className?: string;
    isLoading?: boolean;
}

export function DefectCodeTable({ data = [], className, isLoading }: DefectCodeTableProps) {
    return (
        <Card className={cn("flex flex-col gap-0 shadow-sm border-border min-w-0", className)}>

            <CardHeader className="py-3 px-4 pt-2 border-b border-border">
                <CardTitle className="text-sm font-bold">주요 불량 코드 분석</CardTitle>
            </CardHeader>

            <CardContent className="p-0 overflow-hidden">
                <Table className="w-full table-fixed">
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="h-9 w-[32%] px-4 py-2 text-xs">코드명</TableHead>
                            <TableHead className="h-9 w-[12%] py-2 pl-5 text-xs">구분</TableHead>
                            <TableHead className="h-9 w-[15%] py-2 text-xs text-right">발생 (비율)</TableHead>
                            <TableHead className="h-9 w-[41%] py-2 pl-4 text-xs">문제 현상 요약</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
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
                            data.map((defect) => (
                                <TableRow key={defect.code} className="border-border/50">
                                    <TableCell className="px-4 py-2 pr-5 font-medium align-top">
                                        <div className="flex min-w-0 flex-col">
                                            <span className="break-all text-sm leading-tight [overflow-wrap:anywhere]">{defect.code}</span>
                                            <span className="mt-0.5 break-words text-[10px] leading-tight text-muted-foreground">{defect.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 pl-5 align-top">
                                        <Badge variant="outline" className={`text-[9px] font-normal px-1.5 py-0 h-4 ${defect.type === '공통 불량' ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-500'}`}>
                                            {defect.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 text-right align-top text-sm font-bold">
                                        {defect.count} <span className="text-[10px] text-muted-foreground font-normal">({defect.ratio})</span>
                                    </TableCell>
                                    <TableCell className="py-2 pl-4 align-top text-[11px] leading-snug text-muted-foreground whitespace-normal break-words">
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
