import { Download } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { EquipmentSummaryInfo } from "@/type/equipmentDetailType";

interface EquipmentDetailHeaderProps {
    selectedEquipment: string | null;
    info?: EquipmentSummaryInfo;
    targetDate: Date;
    isSummaryLoading: boolean;
    onOpenEquipmentReport: (id: string) => void;
}

export function EquipmentDetailHeader({
    selectedEquipment,
    info,
    targetDate,
    isSummaryLoading,
    onOpenEquipmentReport,
}: EquipmentDetailHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-background border-b border-border p-6 flex items-center justify-between">
            <SheetHeader className="text-left space-y-1">
                <div className="flex items-center gap-3">
                    <SheetTitle className="text-2xl font-bold">{selectedEquipment}</SheetTitle>

                    {isSummaryLoading ? (
                        <div className="h-5 w-24 bg-muted/20 animate-pulse rounded-full" />
                    ) : (
                        <Badge
                            variant="outline"
                            className={cn(
                                "py-0 h-5 text-[10px]",
                                info?.status === "Critical"
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : info?.status === "Warning"
                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                            )}
                        >
                            {info?.status || "Unknown"} 상태
                        </Badge>
                    )}
                </div>

                <SheetDescription className="flex items-center gap-2">
                    {isSummaryLoading ? (
                        <div className="h-4 w-48 bg-muted/10 animate-pulse rounded mt-1" />
                    ) : (
                        <>
                            <span>
                                기준일{" "}
                                <strong className="font-medium text-foreground">
                                    {format(targetDate, "yyyy-MM-dd")}
                                </strong>
                            </span>
                            <span className="text-muted-foreground/30">|</span>
                            <span>
                                Current Recipe:{" "}
                                <strong className="font-medium text-foreground">{info?.recipe}</strong>
                            </span>
                            <span className="text-muted-foreground/30">|</span>
                            <span>
                                Lot: <strong className="font-medium text-foreground">{info?.currentLot}</strong>
                            </span>
                        </>
                    )}
                </SheetDescription>
            </SheetHeader>

            <Button
                className="gap-2 h-9 text-xs"
                disabled={!selectedEquipment}
                onClick={() => {
                    if (selectedEquipment) {
                        onOpenEquipmentReport(selectedEquipment);
                    }
                }}
            >
                <Download className="w-4 h-4" /> 리포트 PDF 다운로드
            </Button>
        </div>
    );
}
