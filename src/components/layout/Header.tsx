import { Button } from "@/components/ui/button"
import { Cpu, PanelLeft, Search, Bell, User } from "lucide-react"

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
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
            <span>최종 업데이트: 2026-05-06 11:06 KST</span>
        </div>
        
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
            <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative hover:bg-muted/50">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <div className="w-px h-6 bg-border mx-2"></div>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:bg-muted/50">
            <User className="w-5 h-5 bg-secondary rounded-full p-0.5" />
            <span>운영팀</span>
            </Button>
        </div>
        </header>
    )
}