import { useEffect, useRef, useState } from "react"

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { EquipmentDetailSheet } from "@/components/EquipmentDetailSheet"
import { LoginScreen } from "@/components/auth/LoginScreen"

import { Dashboard } from "@/pages/Dashboard"
import { EquipmentStats } from "@/pages/EquipmentStats"
import { ReportPage } from "@/pages/ReportPage"
import { useAuthStore } from "@/store/useAuthStore"

function App() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeMenu, setActiveMenu] = useState("dashboard");

    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [reportEquipmentId, setReportEquipmentId] = useState<string | null>(null);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
    const initializeAuth = useAuthStore((state) => state.initializeAuth);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        void initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, left: 0 });
    }, [activeMenu]);

    const handleOpenEquipmentReport = (equipmentId: string) => {
        setReportEquipmentId(equipmentId);
        setSelectedEquipment(null);
        setActiveMenu("report");
    };

    if (isAuthChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground">
                인증 상태를 확인하는 중입니다...
            </div>
        );
    }

    return isAuthenticated ? (
        <div className="app-shell flex h-screen w-full bg-background text-foreground">

            {/* 1. Sidebar */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
            />

            {/* Main Area */}
            <main className="app-main flex-1 flex flex-col overflow-hidden">

                {/* 2. Header */}
                <Header 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                    onOpenEquipmentDetail={setSelectedEquipment}
                />

                {/* 3. Content Area */}
                <div ref={contentRef} className="app-content flex-1 overflow-auto bg-background p-4 custom-scrollbar md:p-6">
                    <div className="app-content-inner max-w-7xl mx-auto space-y-6">

                        {/* 3.1. Dashboard */}
                        {activeMenu === "dashboard" && <Dashboard />}

                        {/* 3.2. EquipmentStats */}
                        {activeMenu === "equipment" && (
                            <EquipmentStats setSelectedEquipment={setSelectedEquipment} />)}
                    
                        {/* 3.3. DailyReport */}
                        {activeMenu === "report" &&  <ReportPage requestedEquipmentId={reportEquipmentId} />}
                    </div>
                </div>

                {/* 4. EquipmentDetailSheet */}
                <EquipmentDetailSheet 
                    selectedEquipment={selectedEquipment} 
                    setSelectedEquipment={setSelectedEquipment} 
                    onOpenEquipmentReport={handleOpenEquipmentReport}
                />
            </main>
        </div>
    ) : (
        <LoginScreen />
    )
}

export default App
