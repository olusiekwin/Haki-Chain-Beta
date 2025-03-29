import type React from "react"
import { Outlet } from "react-router-dom"
import { config } from "../../utils/config"

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">{config.appName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">The hybrid legal services platform</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Outlet />
          </div>

          <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

