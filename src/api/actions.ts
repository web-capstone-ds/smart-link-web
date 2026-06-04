import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { apiClient } from "@/api/client";
import { delayForMockData } from "@/api/mockDelay";
import type { ActionItem, PendingActionSummary } from "@/type/actionType";

export interface CreateActionPayload {
    equipmentId: string;
    alarmId?: string | null;
    title: string;
    message: string;
    action?: string;
    status?: string;
    resultBefore?: number | null;
    resultAfter?: number | null;
}

export interface UpdateActionPayload {
    status: string;
    action?: string;
    worker?: string;
}

export async function fetchActions(equipmentId: string, targetDate: Date | string): Promise<ActionItem[]> {
    await delayForMockData();

    const formattedDate = typeof targetDate === "string" ? targetDate : format(targetDate, "yyyy-MM-dd");
    const { from, to } = toBackendDateRange(formattedDate);
    const response = await apiClient.get("/api/v1/actions", {
        params: {
            equipmentId,
            from,
            to,
        },
    });

    return normalizeActions(unwrapArray(response.data));
}

export async function fetchPendingActions(date: DateRange | undefined): Promise<PendingActionSummary[]> {
    await delayForMockData();

    const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : "";
    const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : startDate;
    const response = await apiClient.get("/api/v1/actions/pending", {
        params: {
            startDate,
            endDate,
        },
    });

    const pendingRows = unwrapArray(response.data);
    if (pendingRows.length > 0) {
        return normalizePendingSummaries(pendingRows);
    }

    const range = toBackendDateRange(startDate, endDate);
    const fallbackResponse = await apiClient.get("/api/v1/actions", {
        params: {
            status: "PENDING",
            page: 1,
            size: 100,
            from: range.from,
            to: range.to,
        },
    });

    return summarizePendingActions(normalizeActions(unwrapArray(fallbackResponse.data)));
}

export async function createAction(payload: CreateActionPayload): Promise<ActionItem> {
    const note = payload.action ? `${payload.message} / 조치: ${payload.action}` : payload.message;
    const response = await apiClient.post("/api/v1/actions", {
        equipmentId: payload.equipmentId,
        alarmId: payload.alarmId ?? null,
        actionType: payload.title || payload.action || "OPERATOR_ACTION",
        actionStatus: payload.status ? toBackendActionStatus(payload.status) : undefined,
        performedAt: new Date().toISOString(),
        resultBefore: payload.resultBefore ?? null,
        resultAfter: payload.resultAfter ?? null,
        note,
    });
    return normalizeActions([unwrapObject(response.data)])[0];
}

export async function updateActionStatus(id: string, payload: UpdateActionPayload): Promise<ActionItem> {
    const actionStatus = toBackendActionStatus(payload.status);
    if (actionStatus === "COMPLETED") {
        await apiClient.put(`/api/v1/actions/${id}`, { actionStatus: "IN_PROGRESS" });
    }

    const response = await apiClient.put(`/api/v1/actions/${id}`, {
        actionStatus,
        note: payload.action,
    });
    return normalizeActions([unwrapObject(response.data)])[0];
}

function unwrapArray(value: unknown): unknown[] {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];

    const record = value as Record<string, unknown>;
    const candidates = [record.data, record.content, record.items, record.actions, record.pending];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate;
        if (candidate && typeof candidate === "object") {
            const nested = candidate as Record<string, unknown>;
            if (Array.isArray(nested.content)) return nested.content;
            if (Array.isArray(nested.data)) return nested.data;
            if (Array.isArray(nested.items)) return nested.items;
        }
    }

    return [];
}

function unwrapObject(value: unknown): unknown {
    if (!value || typeof value !== "object") return value;

    const record = value as Record<string, unknown>;
    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) return record.data;
    if (record.item && typeof record.item === "object" && !Array.isArray(record.item)) return record.item;
    if (record.action && typeof record.action === "object" && !Array.isArray(record.action)) return record.action;

    return value;
}

function normalizeActions(rows: unknown[]): ActionItem[] {
    return rows.map((row, index) => {
        const record = row && typeof row === "object" ? row as Record<string, unknown> : {};
        const equipmentId = readString(record, ["equipmentId", "equipment_id", "eq", "eqId", "machineId"]) || "UNKNOWN";
        const message = readString(record, ["message", "description", "comment", "detail", "content", "note"]) || "-";
        const action = readNullableString(record, ["action", "actionText", "action_text", "resolution", "note"]);
        const status = normalizeStatus(readString(record, ["status", "state", "actionStatus"]) || "pending");
        const severity = normalizeSeverity(readString(record, ["severity", "level", "priority"]) || "info");
        const actionType = readString(record, ["actionType", "action_type"]);
        const performedAt = readString(record, ["performedAt", "performed_at"]);

        return {
            id: readString(record, ["id", "actionId", "action_id"]) || `${equipmentId}-${index}`,
            equipmentId,
            severity,
            status,
            title: readString(record, ["title", "alarmName", "alarm_name", "name"]) || actionType || message,
            message,
            action,
            worker: readNullableString(record, ["worker", "assignee", "operator", "updatedBy", "createdBy", "performedBy"]),
            time: readString(record, ["time", "createdAt", "created_at", "updatedAt", "updated_at", "performedAt", "performed_at"]) || "-",
            createdAt: readString(record, ["createdAt", "created_at"]) || performedAt,
            updatedAt: readString(record, ["updatedAt", "updated_at"]),
            yieldBefore: readNumber(record, ["yieldBefore", "yield_before", "beforeYield", "resultBefore"]),
            yieldAfter: readNumber(record, ["yieldAfter", "yield_after", "afterYield", "resultAfter"]),
        };
    });
}

function normalizePendingSummaries(rows: unknown[]): PendingActionSummary[] {
    return rows.map((row) => {
        const record = row && typeof row === "object" ? row as Record<string, unknown> : {};
        const equipmentId = readString(record, ["equipmentId", "equipment_id"]) || "UNKNOWN";

        return {
            equipmentId,
            count: readNumber(record, ["count", "pendingCount", "pending_count"]) ?? 1,
            highestSeverity: normalizeSeverity(readString(record, ["highestSeverity", "highest_severity", "severity"]) || "info"),
            latestMessage: readString(record, ["latestMessage", "latest_message", "message", "note"]) || "-",
            latestTime: readString(record, ["latestTime", "latest_time", "time", "performedAt"]),
        };
    });
}

function summarizePendingActions(actions: ActionItem[]) {
    const pendingActions = actions.filter((action) => action.status === "pending" || action.status === "unresolved");
    const byEquipment = new Map<string, PendingActionSummary>();

    for (const action of pendingActions) {
        const current = byEquipment.get(action.equipmentId);
        if (!current) {
            byEquipment.set(action.equipmentId, {
                equipmentId: action.equipmentId,
                count: 1,
                highestSeverity: action.severity,
                latestMessage: action.message,
                latestTime: action.time,
            });
            continue;
        }

        current.count += 1;
        if (severityRank(action.severity) > severityRank(current.highestSeverity)) {
            current.highestSeverity = action.severity;
            current.latestMessage = action.message;
            current.latestTime = action.time;
        }
    }

    return Array.from(byEquipment.values());
}

function readString(record: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === "string" && value.trim()) return value;
        if (typeof value === "number") return String(value);
    }
    return undefined;
}

function readNullableString(record: Record<string, unknown>, keys: string[]) {
    const value = readString(record, keys);
    return value && value !== "-" ? value : null;
}

function readNumber(record: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
    }
    return null;
}

function normalizeStatus(status: string) {
    const lowered = status.toLowerCase();
    if (["resolved", "completed", "done", "closed", "조치완료"].includes(lowered)) return "resolved";
    if (["in_progress", "in-progress", "progress"].includes(lowered)) return "unresolved";
    if (["pending", "unresolved", "open", "미조치"].includes(lowered)) return "pending";
    return lowered;
}

function toBackendActionStatus(status: string) {
    const lowered = status.toLowerCase();
    if (["resolved", "completed", "done", "closed"].includes(lowered)) return "COMPLETED";
    if (["in_progress", "in-progress", "progress", "unresolved"].includes(lowered)) return "IN_PROGRESS";
    return "PENDING";
}

function normalizeSeverity(severity: string) {
    const lowered = severity.toLowerCase();
    if (["critical", "warning", "info"].includes(lowered)) return lowered;
    return lowered || "info";
}

function severityRank(severity: string) {
    if (severity === "critical") return 3;
    if (severity === "warning") return 2;
    return 1;
}

function toBackendDateRange(startDate: string, endDate = startDate) {
    return {
        from: startDate ? `${startDate}T00:00:00+09:00` : undefined,
        to: endDate ? `${endDate}T23:59:59+09:00` : undefined,
    };
}
