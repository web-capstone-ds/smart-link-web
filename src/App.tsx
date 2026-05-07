import { useState } from "react"

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { EquipmentDetailSheet } from "@/components/EquipmentDetailSheet"

import { Dashboard } from "@/pages/Dashboard"
import { EquipmentStats } from "@/pages/EquipmentStats"
import { DailyReport } from "@/pages/DailyReport"

function App() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeMenu, setActiveMenu] = useState("dashboard");

    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

    return (
        
        <div className="flex h-screen w-full bg-background text-foreground">

            {/* 1. Sidebar */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                activeMenu={activeMenu} 
                setActiveMenu={setActiveMenu} 
            />

            {/* Main Area */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* 2. Header */}
                <Header 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                />

                {/* 3. Content Area */}
                <div className="flex-1 p-6 overflow-auto bg-background custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* 3.1. Dashboard */}
                        {activeMenu === "dashboard" && <Dashboard />}

                        {/* 3.2. EquipmentStats */}
                        {activeMenu === "equipment" && (
                            <EquipmentStats setSelectedEquipment={setSelectedEquipment} />)}
                    
                        {/* 3.3. DailyReport */}
                        {activeMenu === "report" &&  <DailyReport />}
                    </div>
                </div>

                {/* 4. EquipmentDetailSheet */}
                <EquipmentDetailSheet 
                    selectedEquipment={selectedEquipment} 
                    setSelectedEquipment={setSelectedEquipment} 
                />
            </main>
        </div>
    )
}

export default App