import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BaseKpiCardProps {
    title: string;
    icon: React.ReactNode;
    value: string | number;
    unit?: string;
    badgeText?: string;
    badgeClassName?: string; // 뱃지 색상을 밖에서 주입
    className?: string;      // 카드 전체 배경색 등 커스텀 용도
    children?: React.ReactNode; // 하단 세부 내용 (유동적)
}

export function BaseKpiCard({ 
    title, icon, value, unit, badgeText, badgeClassName, className, children 
}: BaseKpiCardProps) {
    return (
        <Card className={cn("border-border shadow-sm relative overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground line-clamp-1">
                    {title}
                </CardTitle>
                {/* 밖에서 넘겨준 아이콘(lucide-react)을 그대로 출력 */}
                <div className="shrink-0">{icon}</div> 
            </CardHeader>
            <CardContent>
                <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold text-foreground">
                        {value} <span className="text-[11px] font-normal text-muted-foreground">{unit}</span>
                    </div>
                    {badgeText && (
                        <span className={cn("font-bold px-1.5 py-0.5 rounded text-[10px] mb-1", badgeClassName)}>
                            {badgeText}
                        </span>
                    )}
                </div>
                
                {/* 하단 세부 내용이 있을 때만 렌더링 (구분선 자동 추가) */}
                {children && (
                    <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-border/50 text-[11px] font-medium text-muted-foreground">
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}