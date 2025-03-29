import type React from "react"
import { useApp } from "../../context/app-context"

const UserStats: React.FC = () => {
  const { user } = useApp()

  // Mock data - in a real app, this would come from an API
  const stats = {
    activeBounties: 3,
    completedBounties: 7,
    tokensEarned: 1250,
    tokensSpent: 850,
    reputation: 4.8,
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
            {user?.profile_image ? (
              <img
                src={user.profile_image || "/placeholder.svg"}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-500">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            {user?.is_verified && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium text-gray-500 mr-2">Reputation:</span>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-1">{stats.reputation}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(stats.reputation) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Active Bounties</h3>
          <p className="text-2xl font-bold">{stats.activeBounties}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold">{stats.completedBounties}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Tokens Earned</h3>
          <p className="text-2xl font-bold">{stats.tokensEarned}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Tokens Spent</h3>
          <p className="text-2xl font-bold">{stats.tokensSpent}</p>
        </div>
      </div>
    </div>
  )
}

export default UserStats

