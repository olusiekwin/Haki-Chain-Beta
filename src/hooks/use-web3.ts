"use client"

import { useState, useEffect, useCallback } from "react"
import { initWeb3, getCurrentAccount, isWalletConnected, getNetworkId } from "../utils/web3-provider"
import type Web3 from "web3"

interface Web3State {
  web3: Web3 | null
  account: string | null
  networkId: number | null
  connected: boolean
  loading: boolean
  error: Error | null
}

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    web3: null,
    account: null,
    networkId: null,
    connected: false,
    loading: true,
    error: null,
  })

  const connectWallet = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const web3 = await initWeb3()
      const account = await getCurrentAccount()
      const connected = await isWalletConnected()
      const networkId = await getNetworkId()

      setState({
        web3,
        account,
        networkId,
        connected,
        loading: false,
        error: null,
      })

      return { web3, account, networkId, connected }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error occurred"),
      }))
      throw error
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setState({
      web3: null,
      account: null,
      networkId: null,
      connected: false,
      loading: false,
      error: null,
    })
  }, [])

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          await connectWallet()
        } else {
          setState((prev) => ({ ...prev, loading: false }))
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error occurred"),
        }))
      }
    }

    checkConnection()
  }, [connectWallet])

  return {
    ...state,
    connectWallet,
    disconnectWallet,
  }
}

