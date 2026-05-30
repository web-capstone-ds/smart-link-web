export interface ActionItem {
    id: string;
    equipmentId: string;
    severity: "critical" | "warning" | "info" | string;
    status: "pending" | "unresolved" | "resolved" | "completed" | string;
    title: string;
    message: string;
    action: string | null;
    worker: string | null;
    time: string;
    createdAt?: string;
    updatedAt?: string;
    yieldBefore?: number | null;
    yieldAfter?: number | null;
}

export interface PendingActionSummary {
    equipmentId: string;
    count: number;
    highestSeverity: "critical" | "warning" | "info" | string;
    latestMessage: string;
    latestTime?: string;
}
