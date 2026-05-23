import { useState, type FormEvent } from "react"
import { Cpu, PanelLeft, Bell, User, LockKeyhole, Loader2, LogOut, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useFilterStore } from "@/store/useFilterStore"
import { useAuthStore } from "@/store/useAuthStore"

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {

    const { lastUpdated } = useFilterStore();
    const { user, isAuthenticated, login, logout } = useAuthStore();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await login({ username, password, remember });
            setPassword("");
            setIsLoginOpen(false);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 print:hidden">
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-muted-foreground hover:bg-muted/50 group shrink-0"
                >
                    {isSidebarOpen ? (
                        <PanelLeft className="w-5 h-5" />
                    ) : (
                        <>
                            <Cpu className="w-5 h-5 block group-hover:hidden transition-all" />
                            <PanelLeft className="w-5 h-5 hidden group-hover:block transition-all" />
                        </>
                    )}
                </Button>
                <span className="min-w-50">
                    최종 업데이트: {lastUpdated}
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground relative hover:bg-muted/50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
                </Button>
                
                <div className="w-px h-6 bg-border mx-2"></div>
                {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="gap-2 text-muted-foreground hover:bg-muted/50">
                            <User className="w-5 h-5 bg-secondary rounded-full p-0.5" />
                            <span className="font-medium text-foreground">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">{user?.department || "운영팀"}</span>
                        </Button>
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
                        <User className="w-5 h-5 bg-secondary rounded-full p-0.5" />
                        <span>로그인</span>
                    </Button>
                )}
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

                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="login-username" className="text-xs font-bold text-muted-foreground">
                                사번 또는 계정 ID
                            </label>
                            <Input
                                id="login-username"
                                autoComplete="username"
                                placeholder="예: OP-1024 또는 rlghk"
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
    )
}
