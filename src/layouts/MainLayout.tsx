import type React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/navigation/Navbar"
import Sidebar from "../components/navigation/Sidebar"
import Footer from "../components/navigation/Footer"
import { useFeatures } from "../hooks/useFeatures"
import AiAssistantWidget from "../components/features/AiAssistantWidget"

const MainLayout: React.FC = () => {
  const { isAiAssistantEnabled } = useFeatures()

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>

      {isAiAssistantEnabled && <AiAssistantWidget />}
    </div>
  )
}

export default MainLayout

