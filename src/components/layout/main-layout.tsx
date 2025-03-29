import type React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../common/navbar"
import Sidebar from "../common/sidebar"
import Footer from "../common/footer"

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout

