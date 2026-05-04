import { Button } from "@/components/ui/button"
import './index.css'

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-slate-900">
      <h1 className="text-4xl font-bold text-white">
        Smart Link Dashboard
      </h1>
      
      {/* shadcn/ui 버튼 적용! */}
      <div className="flex gap-4">
        <Button variant="default">일일 리포트 추출</Button>
        <Button variant="secondary">CSV 다운로드</Button>
        <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 hover:text-white">
          장비 상세 보기
        </Button>
      </div>
    </div>
  )
}

export default App