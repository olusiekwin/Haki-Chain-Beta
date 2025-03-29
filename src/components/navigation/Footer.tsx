import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-primary">
              HakiChain
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Empowering legal services through blockchain technology
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Privacy
            </Link>
            <a
              href="mailto:support@hakichain.com"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} HakiChain. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

