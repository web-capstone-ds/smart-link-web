import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EquipmentMultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (value: string[]) => void;
}

export function EquipmentSelect({ options, selected, onChange }: EquipmentMultiSelectProps) {
    
    const handleToggleEquipment = (id: string) => {
        if (id === "all") {
            onChange([]); // "전체 장비" 클릭 시 선택 배열 비우기
            return;
        }

        if (selected.includes(id)) {
            onChange(selected.filter((item) => item !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    const displayValue = selected.length === 0 
        ? "전체 장비" 
        : selected.length === 1 
            ? selected[0] 
            : `${selected[0]} 외 ${selected.length - 1}대`;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    className="w-44 bg-card border-border text-foreground font-medium h-10 justify-between text-xs px-3"
                >
                    <span className="truncate">{displayValue}</span>
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-1" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-0 bg-card border-border" align="end">
                <div className="flex flex-col p-1 max-h-60 overflow-y-auto hidden-scrollbar">
                    
                    {/* 전체 장비 옵션 항목 */}
                    <div 
                        className={cn(
                            "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            selected.length === 0 && "bg-accent/50 font-medium"
                        )}
                        onClick={() => handleToggleEquipment("all")}
                    >
                        <Check className={cn("mr-2 h-3.5 w-3.5 text-primary", selected.length === 0 ? "opacity-100" : "opacity-0")} />
                        <span>전체 장비</span>
                    </div>

                    <div className="h-px bg-border my-1" />

                    {/* 개별 장비 리스트 옵션 항목 */}
                    {options.map((id) => {
                        const isChecked = selected.includes(id);
                        return (
                            <div 
                                key={id} 
                                className={cn(
                                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isChecked && "bg-accent/30"
                                )}
                                onClick={() => handleToggleEquipment(id)}
                            >
                                <Check className={cn("mr-2 h-3.5 w-3.5 text-primary", isChecked ? "opacity-100" : "opacity-0")} />
                                <span className="truncate">{id}</span>
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}