import { useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { EquipmentHistory } from "@/type/equipmentDetailType";

interface HistoryTimelineSectionProps {
    historyData: EquipmentHistory[];
    isReady: boolean;
    isHistoryLoading: boolean;
    isActionMutating?: boolean;
    onResolveAction?: (id: string, action: string) => void;
    onCreateAction?: (payload: { title: string; message: string; action: string }) => void;
}

export function HistoryTimelineSection({
    historyData,
    isReady,
    isHistoryLoading,
    isActionMutating,
    onResolveAction,
    onCreateAction,
}: HistoryTimelineSectionProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newAction, setNewAction] = useState("");

    const handleCreateAction = () => {
        if (!newTitle.trim() || !newMessage.trim()) return;

        onCreateAction?.({
            title: newTitle.trim(),
            message: newMessage.trim(),
            action: newAction.trim(),
        });
        setNewTitle("");
        setNewMessage("");
        setNewAction("");
        setIsCreateOpen(false);
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Info className="w-5 h-5 text-muted-foreground" /> 최근 조치 이력 및 처리 현황
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => setIsCreateOpen((open) => !open)}
                >
                    <Plus className="w-3.5 h-3.5" />
                    조치 등록
                </Button>
            </div>

            <Card className="border-border p-6 shadow-sm">
                {isCreateOpen && (
                    <div className="mb-6 rounded-lg border border-border bg-muted/10 p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <Input
                                value={newTitle}
                                onChange={(event) => setNewTitle(event.target.value)}
                                placeholder="조치 제목"
                                className="h-9 text-xs"
                            />
                            <Input
                                value={newAction}
                                onChange={(event) => setNewAction(event.target.value)}
                                placeholder="조치 내용"
                                className="h-9 text-xs"
                            />
                        </div>
                        <textarea
                            value={newMessage}
                            onChange={(event) => setNewMessage(event.target.value)}
                            placeholder="이상 현상 또는 검토 내용을 입력"
                            className="mt-3 min-h-20 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        />
                        <div className="mt-3 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setIsCreateOpen(false)}>
                                취소
                            </Button>
                            <Button
                                size="sm"
                                className="h-8 text-xs"
                                onClick={handleCreateAction}
                                disabled={isActionMutating || !newTitle.trim() || !newMessage.trim()}
                            >
                                등록
                            </Button>
                        </div>
                    </div>
                )}

                {isReady && !isHistoryLoading && (!historyData || historyData.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">최근 조치 이력이 없습니다.</p>
                        <p className="text-xs opacity-70 mt-1">해당 장비는 안정적으로 가동 중입니다.</p>
                    </div>
                ) : (
                    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent md:before:mx-auto md:before:translate-x-0">
                        {!isReady || isHistoryLoading ? (
                            <HistorySkeleton />
                        ) : (
                            historyData.map((item, index) => (
                                <HistoryTimelineItem
                                    key={item.id || index}
                                    item={item}
                                    isActionMutating={isActionMutating}
                                    onResolveAction={onResolveAction}
                                />
                            ))
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}

function HistorySkeleton() {
    return (
        <>
            {[1, 2].map((index) => (
                <div key={`history-skeleton-${index}`} className="relative flex animate-pulse items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                    <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-4 border-background bg-muted md:order-1" />
                    <div className="w-[calc(100%-4rem)] space-y-3 rounded-lg border border-border/40 bg-muted/5 p-4 md:w-[calc(50%-2.5rem)]">
                        <div className="flex justify-between">
                            <div className="h-4 w-16 rounded bg-muted/20" />
                            <div className="h-3 w-12 rounded bg-muted/10" />
                        </div>
                        <div className="h-4 w-1/2 rounded bg-muted/20" />
                        <div className="h-3 w-full rounded bg-muted/10" />
                    </div>
                </div>
            ))}
        </>
    );
}

function HistoryTimelineItem({
    item,
    isActionMutating,
    onResolveAction,
}: {
    item: EquipmentHistory;
    isActionMutating?: boolean;
    onResolveAction?: (id: string, action: string) => void;
}) {
    const isUnresolved = item.status === "unresolved";
    const [isResolveOpen, setIsResolveOpen] = useState(false);
    const [actionText, setActionText] = useState("");

    const handleResolveAction = () => {
        if (!actionText.trim()) return;

        onResolveAction?.(item.id, actionText.trim());
        setActionText("");
        setIsResolveOpen(false);
    };

    return (
        <div
            className={cn(
                "group relative flex animate-in items-center justify-between fade-in duration-500 md:justify-normal md:odd:flex-row-reverse",
                isUnresolved && "is-active",
            )}
        >
            <div
                className={cn(
                    "flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-4 border-background shadow md:order-1 md:group-even:translate-x-1/2 md:group-odd:-translate-x-1/2",
                    isUnresolved ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground",
                )}
            >
                {isUnresolved ? (
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
            </div>

            <div
                className={cn(
                    "w-[calc(100%-4rem)] rounded-lg border p-4 shadow-sm md:w-[calc(50%-2.5rem)]",
                    isUnresolved ? "border-destructive/30 bg-destructive/5" : "border-border bg-card",
                )}
            >
                <div className="mb-1 flex items-center justify-between">
                    {isUnresolved ? (
                        <Badge variant="destructive" className="h-4 py-0 text-[9px]">
                            미조치
                        </Badge>
                    ) : (
                        <span className="text-[10px] font-bold text-emerald-500">
                            조치 완료 {item.worker ? `(${item.worker})` : ""}
                        </span>
                    )}
                    <time className={cn("text-[11px] font-medium", isUnresolved ? "text-destructive" : "text-muted-foreground")}>
                        {item.time} {isUnresolved ? "(현재)" : ""}
                    </time>
                </div>

                <div className="mb-1 text-sm font-bold text-foreground">{item.title}</div>
                <div className="mb-2 text-xs text-muted-foreground">{item.description}</div>

                {isUnresolved && (
                    <div className="mt-3">
                        {isResolveOpen ? (
                            <div className="rounded-md border border-destructive/20 bg-background/60 p-2">
                                <textarea
                                    value={actionText}
                                    onChange={(event) => setActionText(event.target.value)}
                                    placeholder="조치 내용을 입력"
                                    className="min-h-18 w-full resize-none rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                />
                                <div className="mt-2 flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => setIsResolveOpen(false)}>
                                        취소
                                    </Button>
                                    <Button size="sm" className="h-7 text-[11px]" onClick={handleResolveAction} disabled={isActionMutating || !actionText.trim()}>
                                        완료 처리
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 border-destructive/20 bg-destructive/5 text-[11px] text-destructive hover:bg-destructive/10"
                                onClick={() => setIsResolveOpen(true)}
                            >
                                조치 완료 입력
                            </Button>
                        )}
                    </div>
                )}

                {item.yieldChange && (
                    <div className="mt-3 flex w-fit items-center gap-2 rounded bg-muted/40 p-1.5 text-[10px] dark:bg-muted/20">
                        <span className="text-muted-foreground">수율 변화</span>
                        <span className="text-muted-foreground/70 line-through">{item.yieldChange.before}%</span>
                        <span className="text-muted-foreground/50">→</span>
                        <span className="font-bold text-emerald-500">{item.yieldChange.after}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
