import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Bell,
    Building2,
    Cpu,
    IdCard,
    Loader2,
    LockKeyhole,
    LogOut,
    PanelLeft,
    Phone,
    ShieldCheck,
    User,
} from "lucide-react";

import { fetchPendingActions } from "@/api/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockEquipmentComparisonData } from "@/data/mockData";
import { useAuthStore } from "@/store/useAuthStore";
import { useFilterStore } from "@/store/useFilterStore";

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    onOpenEquipmentDetail: (id: string) => void;
}

export function Header({ isSidebarOpen, setIsSidebarOpen, onOpenEquipmentDetail }: HeaderProps) {
    const { lastUpdated, appliedDate } = useFilterStore();
    const { user, isAuthenticated, useMockData: isMockMode, login, logout } = useAuthStore();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [useMockData, setUseMockData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { data: pendingActionsRes, isLoading: isPendingLoading } = useQuery({
        queryKey: ["headerPendingActions", appliedDate],
        queryFn: () => fetchPendingActions(appliedDate),
        enabled: isAuthenticated && !!appliedDate?.from && !isMockMode,
        retry: false,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });

    const pendingActions = useMemo(() => {
        if (!isMockMode) return pendingActionsRes || [];

        return mockEquipmentComparisonData
            .filter((eq) => eq.unresolvedAlert)
            .map((eq) => ({
                equipmentId: eq.id,
                count: eq.unresolvedAlertCount ?? 1,
                highestSeverity: eq.yield < 97 || eq.uptime < 90 ? "critical" : "warning",
                latestMessage: eq.majorDefect !== "-" ? eq.majorDefect : "미조치 경보",
            }));
    }, [pendingActionsRes, isMockMode]);

    const pendingTotal = pendingActions.reduce((sum, item) => sum + item.count, 0);
    const roleLabel = getRoleLabel(user?.role);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await login({ username, password, remember, useMockData });
            setPassword("");
            setIsLoginOpen(false);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <header className="h-16 shrink-0 border-b border-border bg-card px-6 print:hidden">
            <div className="flex h-full items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="group shrink-0 text-muted-foreground hover:bg-muted/50"
                    >
                        {isSidebarOpen ? (
                            <PanelLeft className="w-5 h-5" />
                        ) : (
                            <>
                                <Cpu className="block w-5 h-5 transition-all group-hover:hidden" />
                                <PanelLeft className="hidden w-5 h-5 transition-all group-hover:block" />
                            </>
                        )}
                    </Button>
                    <span className="min-w-50">최종 업데이트: {lastUpdated}</span>
                </div>

                <div className="flex items-center gap-4">
                    <Popover open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-muted/50" title="미조치 경보">
                                <Bell className="w-5 h-5" />
                                {pendingTotal > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-destructive/30 bg-destructive/20 px-1 text-[9px] font-black leading-none text-red-200">
                                        {pendingTotal}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-82 p-0">
                            <div className="border-b border-border px-3 py-2.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-foreground">미조치 경보</p>
                                    <Badge variant="secondary" className="h-5 text-[10px]">
                                        {pendingTotal}건
                                    </Badge>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">항목을 선택하면 장비 상세 Sheet로 이동합니다.</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto p-1.5 custom-scrollbar">
                                {isPendingLoading ? (
                                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">경보 목록을 불러오는 중입니다.</div>
                                ) : pendingActions.length === 0 ? (
                                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">미조치 경보가 없습니다.</div>
                                ) : (
                                    pendingActions.map((item) => (
                                        <button
                                            key={item.equipmentId}
                                            type="button"
                                            className="w-full rounded-md px-2.5 py-2 text-left hover:bg-muted/50"
                                            onClick={() => {
                                                onOpenEquipmentDetail(item.equipmentId);
                                                setIsAlertOpen(false);
                                            }}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-foreground">{item.equipmentId}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={`h-5 text-[9px] ${item.highestSeverity === "critical" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-amber-500/30 bg-amber-500/10 text-amber-600"}`}
                                                >
                                                    {item.count}건
                                                </Badge>
                                            </div>
                                            <p className="mt-1 truncate text-[11px] text-muted-foreground">{item.latestMessage}</p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="w-px h-6 mx-2 bg-border" />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Popover open={isUserOpen} onOpenChange={setIsUserOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="h-10 gap-2 px-2 text-muted-foreground hover:bg-muted/50">
                                        <User className="w-5 h-5 rounded-full bg-secondary p-0.5" />
                                        <div className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
                                            <span className="max-w-32 truncate text-sm font-medium text-foreground">{user?.name}</span>
                                            <span className="max-w-36 truncate text-[11px] text-muted-foreground">
                                                {user?.department || "운영팀"} · {roleLabel}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`hidden h-5 text-[10px] sm:inline-flex ${user?.active === false ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"}`}
                                        >
                                            {user?.active === false ? "Inactive" : "Active"}
                                        </Badge>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-84 p-0">
                                    <div className="border-b border-border px-4 py-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-base font-bold text-foreground">{user?.name}</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">{user?.operatorId || "계정 ID 없음"}</p>
                                            </div>
                                            <Badge variant="outline" className={`h-6 shrink-0 text-[10px] ${getRoleBadgeClass(user?.role)}`}>
                                                {roleLabel}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2 p-3">
                                        <UserInfoRow icon={<IdCard className="w-3.5 h-3.5" />} label="Operator ID" value={user?.operatorId || "-"} />
                                        <UserInfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="Department" value={user?.department || "-"} />
                                        <UserInfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={user?.phone || "-"} />
                                        <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                                            <div>
                                                <p className="text-[11px] font-medium text-muted-foreground">Account Status</p>
                                                <p className="mt-0.5 text-xs font-semibold text-foreground">
                                                    {user?.active === false ? "비활성 계정" : "활성 계정"}
                                                </p>
                                            </div>
                                            <span className={`size-2 rounded-full ${user?.active === false ? "bg-destructive" : "bg-emerald-500"}`} />
                                        </div>
                                        {user?.updatedAt && (
                                            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                                                <p className="text-[11px] font-medium text-muted-foreground">Updated</p>
                                                <p className="mt-0.5 text-xs text-foreground">{formatUserDate(user.updatedAt)}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-border p-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-2 text-muted-foreground hover:bg-muted/50"
                                            onClick={() => {
                                                setIsUserOpen(false);
                                                void logout();
                                            }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            로그아웃
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:bg-muted/50"
                                onClick={() => void logout()}
                                title="로그아웃"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            className="gap-2 text-muted-foreground hover:bg-muted/50"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            <User className="w-5 h-5 rounded-full bg-secondary p-0.5" />
                            <span>로그인</span>
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                    <div className="border-b border-border bg-muted/30 px-6 py-5">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold">Smart Link 업무 로그인</DialogTitle>
                                    <DialogDescription className="mt-1">
                                        현장 운영/품질 리포트 접근을 위해 계정 인증이 필요합니다.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                        <div className="space-y-1.5">
                            <label htmlFor="login-username" className="text-xs font-bold text-muted-foreground">
                                사번 또는 계정 ID
                            </label>
                            <Input
                                id="login-username"
                                autoComplete="username"
                                placeholder="예: EMP001"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                className="h-10"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="login-password" className="text-xs font-bold text-muted-foreground">
                                비밀번호
                            </label>
                            <Input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="h-10"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                            <label htmlFor="remember-session" className="flex items-center gap-2 text-xs text-muted-foreground">
                                <input
                                    id="remember-session"
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(event) => setRemember(event.target.checked)}
                                    className="size-3.5 accent-primary"
                                />
                                이 장비에서 로그인 유지
                            </label>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <LockKeyhole className="w-3 h-3" />
                                JWT 인증
                            </div>
                        </div>

                        <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
                            <label htmlFor="login-use-mock" className="flex items-start gap-2 text-xs text-muted-foreground">
                                <input
                                    id="login-use-mock"
                                    type="checkbox"
                                    checked={useMockData}
                                    onChange={(event) => setUseMockData(event.target.checked)}
                                    className="mt-0.5 size-3.5 accent-primary"
                                />
                                <span>
                                    서버 데이터가 없을 때 모의데이터 표시
                                    <span className="mt-0.5 block text-[10px] text-muted-foreground/80">
                                        선택하지 않으면 서버 미연결 또는 데이터 없음 안내만 표시합니다.
                                    </span>
                                </span>
                            </label>
                        </div>

                        {errorMessage && (
                            <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                                {errorMessage}
                            </div>
                        )}

                        <DialogFooter className="-mx-6 -mb-5 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsLoginOpen(false)}
                                disabled={isSubmitting}
                            >
                                취소
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-24">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        인증 중
                                    </>
                                ) : (
                                    "로그인"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </header>
    );
}

function UserInfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
            <div className="text-muted-foreground">{icon}</div>
            <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-foreground">{value}</p>
            </div>
        </div>
    );
}

function getRoleLabel(role?: string) {
    switch (role) {
        case "ADMIN":
            return "관리자";
        case "ENGINEER":
            return "엔지니어";
        case "OPERATOR":
            return "작업자";
        case "INSPECTOR":
            return "검사원";
        default:
            return role || "역할 없음";
    }
}

function getRoleBadgeClass(role?: string) {
    switch (role) {
        case "ADMIN":
            return "border-sky-500/30 bg-sky-500/10 text-sky-600";
        case "ENGINEER":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600";
        case "INSPECTOR":
            return "border-amber-500/30 bg-amber-500/10 text-amber-600";
        case "OPERATOR":
            return "border-muted-foreground/20 bg-muted/30 text-muted-foreground";
        default:
            return "border-border bg-muted/20 text-muted-foreground";
    }
}

function formatUserDate(value: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
