import { useApp } from "../context/AppContext"

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, login, logout } = useApp()

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  }
}

