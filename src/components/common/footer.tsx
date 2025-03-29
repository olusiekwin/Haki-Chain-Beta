import type React from "react"
import { config } from "../../utils/config"

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
        </div>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

