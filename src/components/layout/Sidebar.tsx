import { Button } from "@/components/ui/button"
import { Cpu, LayoutDashboard, FileText, Settings } from "lucide-react"

// 부모(App.tsx)로부터 받아올 리모컨(Props)의 타입을 정의합니다.
interface SidebarProps {
    isSidebarOpen: boolean;
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
}

export function Sidebar({ isSidebarOpen, activeMenu, setActiveMenu }: SidebarProps) {
    return (
        <aside 
        className={`
            ${isSidebarOpen ? "w-64" : "w-0 border-r-0"} 
            transition-[width,border] duration-300 ease-in-out 
            border-r border-border bg-card flex flex-col overflow-hidden shrink-0
        `}
        >
        <div className="w-64 flex flex-col h-full">
            <div className="h-16 flex items-center px-6 border-b border-border shrink-0 gap-1.5">
            <div className="p-1.5 rounded-lg">
                <Cpu className="w-5 h-5 block text-muted-foreground transition-all" />
            </div>
            <span className="text-lg font-bold text-primary tracking-wider">SMART LINK</span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Button 
                variant={activeMenu === "dashboard" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${activeMenu !== "dashboard" && "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveMenu("dashboard")}
            >
                <LayoutDashboard className="w-4 h-4" />
                종합 대시보드
            </Button>

            <Button 
                variant={activeMenu === "equipment" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${activeMenu !== "equipment" && "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveMenu("equipment")}
            >
                <Cpu className="w-4 h-4" />
                장비 현황 통계
            </Button>

            <Button 
                variant={activeMenu === "report" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${activeMenu !== "report" && "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveMenu("report")}
            >
                <FileText className="w-4 h-4" />
                일일 리포트
            </Button>
            </nav>

            <div className="p-4 border-t border-border shrink-0">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <Settings className="w-4 h-4" />
                시스템 설정
            </Button>
            </div>
        </div>
        </aside>
    )
}