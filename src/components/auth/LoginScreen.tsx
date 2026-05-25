import { useState, type FormEvent } from "react";
import { Cpu, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

export function LoginScreen() {
    const { login } = useAuthStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [useMockData, setUseMockData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await login({ username, password, remember, useMockData });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground flex">
            <section className="hidden lg:flex w-[38%] min-w-100 bg-zinc-950 text-white p-10 flex-col justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-white text-zinc-950">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">SMART LINK</p>
                        <p className="text-xs text-zinc-400">Vision Inspection Operations</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Authorized personnel only
                    </div>
                    <div>
                        <h1 className="text-3xl font-black leading-tight">현장 운영 데이터 접근 인증</h1>
                        <p className="mt-4 text-sm leading-6 text-zinc-400">
                            생산, 품질, 설비 상태 및 리포트 데이터는 로그인된 작업자와 관리자에게만 표시됩니다.
                        </p>
                    </div>
                </div>

                <div className="text-xs text-zinc-500">
                    임시 계정: user / user
                </div>
            </section>

            <section className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">SMART LINK</p>
                            <p className="text-xs text-muted-foreground">Vision Inspection Operations</p>
                        </div>
                    </div>

                    <div className="border border-border bg-card p-6 shadow-sm rounded-lg">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold">로그인</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                업무 계정으로 인증 후 대시보드에 접근할 수 있습니다.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="gate-username" className="text-xs font-bold text-muted-foreground">
                                    사번 또는 계정 ID
                                </label>
                                <Input
                                    id="gate-username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    className="h-10"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="gate-password" className="text-xs font-bold text-muted-foreground">
                                    비밀번호
                                </label>
                                <Input
                                    id="gate-password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="h-10"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                                <label htmlFor="gate-remember" className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <input
                                        id="gate-remember"
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
                                <label htmlFor="gate-use-mock" className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <input
                                        id="gate-use-mock"
                                        type="checkbox"
                                        checked={useMockData}
                                        onChange={(event) => setUseMockData(event.target.checked)}
                                        className="mt-0.5 size-3.5 accent-primary"
                                    />
                                    <span>
                                        서버 데이터가 없을 때 목데이터 표시
                                        <span className="block mt-0.5 text-[10px] text-muted-foreground/80">
                                            선택하지 않으면 서버 미연동 또는 데이터 없음 안내만 표시됩니다.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            {errorMessage && (
                                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                                    {errorMessage}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        인증 중
                                    </>
                                ) : (
                                    "로그인"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
